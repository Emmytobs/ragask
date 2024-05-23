from enum import Enum
from typing import List
from beanie import Document, PydanticObjectId


class SubscriptionDetails(Enum):
    BASIC = "basic"
    STANDARD = "standard"
    UNLIMITED = "unlimited"


class User(Document):
    name: str
    subscription_details: SubscriptionDetails
    last_accessed_pdfs: List[PydanticObjectId]
