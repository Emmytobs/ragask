"""Module for handling user routes in the API."""

from api.models.users import User
from fastapi import APIRouter


router = APIRouter()


@router.post("/", response_description="Add user to database")
async def add_user(user: User) -> User:
    result = await user.insert()
    return result
