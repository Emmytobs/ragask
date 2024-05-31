"""API version 1 routing configuration."""

from fastapi import APIRouter
from routes import users
from routes.documents import documents


api_v1_router = APIRouter()

api_v1_router.include_router(documents.router, tags=["Document"], prefix="/documents")

api_v1_router.include_router(users.router, tags=["User"], prefix="/users")
