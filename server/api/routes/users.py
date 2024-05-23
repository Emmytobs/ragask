"""Module for handling user routes in the API."""

from api.models.user import User
from fastapi import APIRouter


router = APIRouter()


@router.post("/", response_description="Review added to the database")
async def add_user(user: User) -> User:
    result = await user.insert()
    return result
