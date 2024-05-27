"""Module for defining user-related database models."""

from enum import Enum
from beanie import Document, PydanticObjectId


class SubscriptionDetails(Enum):
    BASIC = "basic"
    STANDARD = "standard"
    UNLIMITED = "unlimited"


class User(Document):
    name: str
    email: str
    avatar: str
    subscription_details: str = SubscriptionDetails.BASIC
    last_accessed_pdfs: list[PydanticObjectId] = []

    class Settings:
        name = "users"