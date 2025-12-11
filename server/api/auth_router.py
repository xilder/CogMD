# app/api/auth_router.py
from os import access
import os
from typing import Annotated, Any, cast

from fastapi import (
    APIRouter,
    Cookie,
    Depends,
    HTTPException,
    Request,
    Response,
    status,
)
from fastapi.responses import RedirectResponse
from gotrue.errors import AuthApiError
from jose import JWTError, jwt
from postgrest import APIResponse
from supabase import AsyncClient

from server.core.config import settings
from server.db.db import get_supabase_client

# Import our new, specific schemas and dependencies
from server.models.schemas import (
    LoginResponse,
    OAuthCallback,
    Token,
    UserAuthResponse,
    UserCreate,
    UserLogin,
)

# Initialize the router
router = APIRouter(prefix="/auth", tags=["Authentication"])
origin_url = os.environ.get("ORIGIN_URL", "http://localhost:3000") 


# --- Helper function to set the secure cookie ---
def set_refresh_token_cookie(response: Response, token: str | None) -> None:
    """Sets the refresh token in a secure, HttpOnly cookie."""
    response.set_cookie(
        key="cognito_refresh_token",
        value=token,
        httponly=True,
        samesite="lax",
        secure=False,
        path="/",
        max_age=60 * 60 * 24 * 30,
    )


def remove_refresh_token_cookie(response: Response) -> None:
    """
    Removes the refresh token cookie.
    """
    response.delete_cookie(
        key="cognito_refresh_token",
        path="/",
        secure=False,
        httponly=True,
        samesite="lax",
    )


@router.post("/register", response_model=UserAuthResponse, status_code=201)
async def register_user(
    user_credentials: UserCreate,
    supabase: Annotated[AsyncClient, Depends(get_supabase_client)],
    response: Response,
):
    """
    Handles new user registration via email and password.
    1. Creates the user in Supabase's secure 'auth.users' table.
    2. Creates a corresponding public profile in 'user' table.
    """
    try:
        # Securely sign up the user via Supabase Auth
        auth_response = await supabase.auth.sign_up(
            {"email": user_credentials.email, "password": user_credentials.password}
        )

        if not auth_response.user or not auth_response.user.id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User could not be created in Auth service.",
            )

        user_id = auth_response.user.id

        # Step 2: Create the corresponding public user profile
        profile_data = {
            "id": str(user_id),
            "username": user_credentials.username,
            "full_name": user_credentials.full_name,
            "email": user_credentials.email,
        }

        # Insert the profile and immediately select it back to return to the user
        _profile_response = await supabase.table("user").insert(profile_data).execute()
        profile_response = cast(APIResponse, _profile_response)

        response_data = cast(dict[str, Any], profile_response.data[0])
        response_data["email"] = auth_response.user.email

        return response_data

    except AuthApiError as e:
        remove_refresh_token_cookie(response)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=e.message)


@router.post("/login", response_model=LoginResponse)
async def login_for_access_token(
    response: Response,
    form_data: UserLogin,
    supabase: Annotated[AsyncClient, Depends(get_supabase_client)],
):
    """
    Handles email/password login.
    1. Verifies credentials with Supabase Auth.
    2. Updates the 'last_login' timestamp in our public 'user' table.
    3. Returns JWT access and refresh tokens.
    """
    try:
        auth_response = await supabase.auth.sign_in_with_password(
            {"email": form_data.username, "password": form_data.password}
        )

        if not auth_response.session or not auth_response.user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
            )

        set_refresh_token_cookie(response, auth_response.session.refresh_token)

        user = auth_response.user

        # Fetch the public profile to return alongside the token
        profile_response = (
            await supabase.table("user")
            .select("id, full_name, username, plan, xp_points")
            .eq("id", str(user.id))
            .single()
            .execute()
        )
        if not profile_response.data:
            raise HTTPException(
                status_code=404, detail="User public profile not found."
            )

        # Update last_login timestamp
        await supabase.table("user").update({"last_login": "now()"}).eq(
            "id", str(user.id)
        ).execute()

        user_profile = cast(UserAuthResponse, profile_response.data)
        user_profile["email"] = cast(str, user.email)

        return LoginResponse(
            access_token=auth_response.session.access_token,
            user=user_profile,
        )

    except Exception as e:
        remove_refresh_token_cookie(response)
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))


# @router.get("/google/login")
# async def google_login(
#     request: Request,
#     supabase: Annotated[AsyncClient, Depends(get_supabase_client)],
#     response: Response,
# ):
#     """
#     Generates the Google OAuth sign-in URL for the frontend to redirect to.
#     This initiates the secure PKCE flow.
#     """
#     try:
#         # This automatically handles the secure PKCE code_challenge
#         data = await supabase.auth.sign_in_with_oauth(
#             {
#                 "provider": "google",
#                 "options": {"redirect_to": "http://localhost:3000/callback"},
#             }
#         )
#         print(data.url)
#         return {"url": data.url}
#     except AuthApiError as e:
#         print(e)
#         remove_refresh_token_cookie(response)
#         raise HTTPException(
#             status_code=500, detail=f"Error generating OAuth URL: {e.message}"
#         )


@router.post("/google/callback", response_model=Token)
async def google_callback(
    response: Response,
    callback_data: OAuthCallback,
    supabase: Annotated[AsyncClient, Depends(get_supabase_client)],
):
    """
    Handles the callback from the frontend after Google authentication.
    1. Exchanges the auth code for a user session using PKCE.
    2. Creates a public user profile if it's the user's first time ("upsert" logic).
    3. Updates 'last_login' timestamp.
    4. Returns JWT tokens.
    """
    try:
        session_response = await supabase.auth.exchange_code_for_session(
            {
                "auth_code": callback_data.code,
                "code_verifier": callback_data.code_verifier,
                "redirect_to": f"{origin_url}/callback",
            }
        )

        json_data = session_response.json()

        user = json_data.get("user", None)

        if not user:
            raise HTTPException(status_code=401, detail="Could not log in with Google.")

        profile_data = {
            "id": user.get("id"),
            "full_name": user.get("user_metadata", None).get("full_name"),
            "avatar_url": user.get("user_metadata", None).get("avatar_url"),
            "username": user.get("user_metadata", None).get("email", "").split("@")[0],
            "email": user.get("user_metadata", None).get("email", ""),
            "last_login": "now()"
        }
        profile_response = await supabase.table("user").upsert(profile_data).execute()

        # await supabase.table("user").update({"last_login": "now()"}).eq(
        #     "id", str(user.get('id'))
        # ).execute()

        refresh_token = json_data.get("refresh_token")
        access_token = json_data.get("access_token")

        set_refresh_token_cookie(response, refresh_token)

        user_profile = cast(UserAuthResponse, profile_response.data[0])

        return LoginResponse(
            access_token=access_token,
            user=user_profile,
        )

    except AuthApiError as e:
        remove_refresh_token_cookie(response)
        raise HTTPException(
            status_code=400, detail=f"OAuth callback error: {e.message}"
        )


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout(
    supabase: Annotated[AsyncClient, Depends(get_supabase_client)], response: Response
):
    """
    Logs out the current user by invalidating their session on Supabase.
    The supabase-python client needs to be authenticated for this to work,
    which it will be if the user's JWT is passed in the request header.
    """
    try:
        await supabase.auth.sign_out()
        set_refresh_token_cookie(response, None)
    except AuthApiError as e:
        remove_refresh_token_cookie(response)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=e.message)


@router.post("/refresh-token", response_model=Token)
async def refresh_access_token(
    response: Response,
    request: Request,
    supabase: Annotated[AsyncClient, Depends(get_supabase_client)],
    cognito_refresh_token=Cookie(None, alias="cognito_refresh_token"),
):
    """
    Gets a new access token by validating the refresh token from the HttpOnly cookie.
    This allows the user's session to be extended without requiring them to log in again.
    """
    if cognito_refresh_token is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorised")

    authorisation = request.headers.get("authorization", None)

    if authorisation is not None:
        token = authorisation.split()[1]
        try:
            payload = jwt.decode(
                token,
                settings.SUPABASE_JWT_SECRET,
                algorithms=["HS256"],
                audience="authenticated",
            )
            if payload:
                return {"access_token": token}
        except JWTError:
            pass

    try:
        refresh_response = await supabase.auth.refresh_session(cognito_refresh_token)

        if not refresh_response.session:
            set_refresh_token_cookie(response, None)
            await supabase.auth.sign_out()
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired refresh token.",
            )

        set_refresh_token_cookie(response, refresh_response.session.refresh_token)

        return {"access_token": refresh_response.session.access_token}

    except AuthApiError:
        remove_refresh_token_cookie(response)
        await supabase.auth.sign_out()
