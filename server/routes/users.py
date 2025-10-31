# app/api/auth_router.py
from typing import Annotated, Any, cast

from db.db import get_supabase_client
from fastapi import APIRouter, Depends, HTTPException, Request, status
from gotrue.errors import AuthApiError

# Import our new, specific schemas and dependencies
from models.schemas import (
    OAuthCallback,
    Token,
    UserAuthResponse,
    UserCreate,
    UserLogin,
)
from postgrest import APIResponse
from supabase import AsyncClient

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=UserAuthResponse, status_code=201)
async def register_user(
    user_credentials: UserCreate,
    supabase: Annotated[AsyncClient, Depends(get_supabase_client)],
):
    """
    Handles new user registration via email and password.
    1. Creates the user in Supabase's secure 'auth.users' table.
    2. Creates a corresponding public profile in 'user' table.
    """
    try:
        # Step 1: Securely sign up the user via Supabase Auth
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
        }

        # Insert the profile and immediately select it back to return to the user
        _profile_response = await supabase.table("user").insert(profile_data).execute()
        profile_response = cast(APIResponse, _profile_response)

        # The email is not stored in our public table, so we add it from the auth response for the return object
        response_data = cast(dict[str, Any], profile_response.data[0])
        response_data["email"] = auth_response.user.email

        return response_data

    except AuthApiError as e:
        # This catches specific Supabase errors, like "User already registered"
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=e.message)


@router.post("/login", response_model=Token)
async def login_for_access_token(
    form_data: UserLogin, supabase: Annotated[AsyncClient, Depends(get_supabase_client)]
):
    """
    Handles email/password login.
    1. Verifies credentials with Supabase Auth.
    2. Updates the 'last_login' timestamp in our public 'user' table.
    3. Returns JWT access and refresh tokens.
    """
    try:
        # Step 1: Securely verify credentials with Supabase Auth
        auth_response = await supabase.auth.sign_in_with_password(
            {"email": form_data.username, "password": form_data.password}
        )

        if not auth_response.session or not auth_response.user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
            )

        # Step 2: Update the last_login timestamp in the public user profile
        await supabase.table("user").update({"last_login": "now()"}).eq(
            "id", str(auth_response.user.id)
        ).execute()

        # Step 3: Return the tokens
        return Token(
            access_token=auth_response.session.access_token,
            refresh_token=auth_response.session.refresh_token,
        )
    except AuthApiError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=e.message)


@router.get("/google/login")
async def google_login(
    request: Request, supabase: Annotated[AsyncClient, Depends(get_supabase_client)]
):
    """
    Generates the Google OAuth sign-in URL for the frontend to redirect to.
    This initiates the secure PKCE flow.
    """
    try:
        # This automatically handles the secure PKCE code_challenge
        data, error = await supabase.auth.sign_in_with_oauth(
            {
                "provider": "google",
                "options": {"redirect_to": "http://localhost:3000/auth/callback"},
            }
        )
        if error:
            raise HTTPException(
                status_code=500, detail=f"Error generating OAuth URL: {error[0]}"
            )

        return {"url": data[0]}
    except AuthApiError as e:
        raise HTTPException(
            status_code=500, detail=f"Error generating OAuth URL: {e.message}"
        )


@router.post("/google/callback", response_model=Token)
async def google_callback(
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
        # Step 1: Securely exchange the code for a session
        session_response = await supabase.auth.exchange_code_for_session(
            {
                "auth_code": callback_data.code,
                "code_verifier": callback_data.code_verifier,
                "redirect_to": "http://localhost:3000/auth/callback",
            }
        )

        if not session_response.user or not session_response.session:
            raise HTTPException(status_code=401, detail="Could not log in with Google.")

        user = session_response.user

        # Step 2: "Upsert" logic - create a public profile if one doesn't exist
        # This handles both registration and login for Google users in one step.
        profile_data = {
            "id": str(user.id),
            "full_name": user.user_metadata.get("full_name"),
            "avatar_url": user.user_metadata.get("avatar_url"),
            "username": user.user_metadata.get("email", "").split("@"),
        }
        await supabase.table("user").upsert(
            {**profile_data, "last_login": "now()"}
        ).execute()

        return Token(
            access_token=session_response.session.access_token,
            refresh_token=session_response.session.refresh_token,
        )
    except AuthApiError as e:
        raise HTTPException(
            status_code=400, detail=f"OAuth callback error: {e.message}"
        )


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout(supabase: Annotated[AsyncClient, Depends(get_supabase_client)]):
    """
    Logs out the current user by invalidating their session on Supabase.
    The supabase-python client needs to be authenticated for this to work,
    which it will be if the user's JWT is passed in the request header.
    """
    try:
        await supabase.auth.sign_out()
    except AuthApiError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=e.message)
