"""API version 1 routing configuration."""

from fastapi import APIRouter

import src.documents.views as documents
import src.users.views as users


api_v1_router = APIRouter()

api_v1_router.include_router(documents.router, tags=["Document"], prefix="/documents")
api_v1_router.include_router(users.router, tags=["User"], prefix="/users")
