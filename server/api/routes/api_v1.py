"""API version 1 routing configuration."""

from fastapi import APIRouter
from api.routes import users, files


api_v1_router = APIRouter()

api_v1_router.include_router(files.router, tags=["File"], prefix="/files")
api_v1_router.include_router(users.router, tags=["User"], prefix="/users")
