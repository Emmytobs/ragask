"""Module for handling user routes in the API."""

from fastapi import APIRouter
from models.users import User


router = APIRouter()


@router.post("/", response_description="Add user to database")
async def add_user(user: User) -> User:
    result = await user.insert()
    return result


@router.get("/{email}", response_description="Get user by email")
async def get_user(email: str) -> User:
    result = await User.find_one({"email": email})
    return result


@router.get("/", response_description="Get all users")
async def get_users() -> list[User]:
    result = await User.find_all().to_list()
    return result
