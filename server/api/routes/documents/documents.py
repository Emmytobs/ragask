"""Module for handling document-related routes in the API."""

from fastapi import APIRouter

from routes.documents import pdfs

router = APIRouter()

router.include_router(pdfs.router, prefix="/pdf", tags=["Pdf"])
