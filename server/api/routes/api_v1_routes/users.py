"""Module for handling user routes in the API."""

from api.models.users import User
from fastapi import APIRouter, Request


router = APIRouter()


@router.post("/", response_description="Add user to database")
async def add_user(user: User) -> User:
    result = await user.insert()
    return result


@router.get("/", response_description="Get all users")
async def get_users(request: Request) -> list[User]:
    result = await User.find_all().to_list()
    return result
