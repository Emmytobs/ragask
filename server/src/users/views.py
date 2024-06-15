"""Module for handling user routes in the API."""

from fastapi import APIRouter
from users.models import User


router = APIRouter()


@router.post("/", response_description="Add user to database")
async def add_user(user: User) -> User:
    user = await user.insert()
    return user


@router.get("/{email}", response_description="Get user by email")
async def get_user(email: str) -> User:
    test = await User.find_one({"email": email})
    return test


@router.get("/", response_description="Get all users")
async def get_users() -> list[User]:
    result = await User.find_all().to_list()
    return result
