# app/core/dependencies.py

from typing import Annotated
import uuid

from core.config import settings
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer, OAuth2PasswordBearer
from jose import JWTError, jwt
from models.schemas import TokenData

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")
http_bearer_scheme = HTTPBearer()

async def get_current_user(token: Annotated[HTTPAuthorizationCredentials, Depends(http_bearer_scheme)]) -> TokenData:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(
            token.credentials,
            settings.SUPABASE_JWT_SECRET,
            algorithms=["HS256"],
            audience="authenticated",
        )
        user_id_str = payload.get("sub")
        if user_id_str is None:
            raise credentials_exception

        token_data = TokenData(user_id=uuid.UUID(user_id_str))
        return token_data
    except JWTError:
        raise credentials_exception
