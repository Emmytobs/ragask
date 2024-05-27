import jwt

from api.models.users import User
from api.config import settings

from google.oauth2 import id_token
from google.auth.transport import requests

from fastapi import HTTPException, Request, status


async def get_user_from_db(email: str):
    user = await User.find_one({"email": email})
    return user


def verify_google_token(token: str):
    user_info = id_token.verify_oauth2_token(
        token, requests.Request(), settings.google_client_id
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
        user_info = verify_google_token(token=token)
        request.state.user = await get_user_from_db(user_info["email"])
    except jwt.ExpiredSignatureError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Token has expired"
        ) from exc
    except jwt.InvalidTokenError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token"
        ) from exc
