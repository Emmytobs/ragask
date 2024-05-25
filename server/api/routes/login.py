"""Module for handling login and authentication routes."""

from api.controllers.login import oauth
from api.models.users import User
from fastapi import APIRouter, Request


router = APIRouter()


@router.get("/login")
async def login(provider: str, request: Request):
    redirect_uri = request.url_for("auth")
    client = oauth.create_client(provider)
    request.session["oauth_provider"] = provider
    redirect = await client.authorize_redirect(request, redirect_uri)
    return redirect


@router.get("/auth")
async def auth(request: Request) -> User:
    oauth_provider = request.session.get("oauth_provider")
    if not oauth_provider:
        return {"error": "OAuth provider not found in session."}
    client = oauth.create_client(oauth_provider)
    token = await client.authorize_access_token(request)
    provider_user = token["userinfo"]
    user = await User.find_one({"email": provider_user.email})
    if user:
        return user

    user = await User(
        email=provider_user.email,
        name=provider_user.name,
        avatar=provider_user.picture,
    ).insert()

    request.session["user"] = user

    return user
