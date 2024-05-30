"""Middleware for validating JWT tokens"""

from typing import Any
import jwt

from models.users import User
from config import ENV_VARS
from app_logging import logger

from google.oauth2 import id_token
from google.auth.transport import requests
from google.auth.exceptions import InvalidValue

from fastapi import HTTPException, Request, status
from pymongo.errors import DuplicateKeyError


async def _get_or_add_user(user_info: Any):
    email = user_info["email"]
    name = user_info["name"]
    picture = user_info["picture"]

    user = await User.find_one({"email": email})

    if user is None:
        user = User(
            name=name,
            avatar=picture,
            email=email,
        )
        try:
            await user.insert()
        except DuplicateKeyError as e:
            error_message = f"User with email {email} already exists"

            logger.error(error_message)
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=error_message,
            ) from e

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
