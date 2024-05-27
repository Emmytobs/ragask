"""Middleware for validating JWT tokens"""

from typing import Any
import jwt

from api.models.users import User
from api.config import ENV_VARS

from google.oauth2 import id_token
from google.auth.transport import requests
from google.auth.exceptions import InvalidValue

from fastapi import HTTPException, Request, status


async def _get_or_add_user(user_info: Any):
    user = await User.find_one({"email": user_info["email"]})
    if not user:
        user = User(
            name=user_info["name"],
            avatar=user_info["picture"],
            email=user_info["email"],
        )
        await User.insert_one(user)

    return user


def _verify_google_token(token: str):
    user_info = id_token.verify_oauth2_token(
        token, requests.Request(), ENV_VARS.google_client_id
    )
    return user_info


async def validate_jwt(request: Request):
    token_with_bearer = request.headers.get("Authorization", "")
    if not token_with_bearer:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization token is missing",
        )

    token = (
        token_with_bearer.split(" ")[1]
        if len(token_with_bearer.split(" ")) == 2
        else None
    )
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header format",
        )

    try:
        user_info = _verify_google_token(token=token)
        request.state.user = await _get_or_add_user(user_info)
    except jwt.ExpiredSignatureError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Token has expired"
        ) from exc
    except jwt.InvalidTokenError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token"
        ) from exc
    except InvalidValue as invalid_value:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail=str(invalid_value)
        ) from invalid_value
