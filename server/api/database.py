"""Module for initializing the database connection and setting up Beanie with FastAPI."""

import os
from api.models.files import File
from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient


async def init_db():
    client = AsyncIOMotorClient(os.getenv("MONGODB_URI", ""))
    await init_beanie(database=client.ragask, document_models=[File])
