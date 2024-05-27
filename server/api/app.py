"""Module for initializing the FastAPI application and including routers."""

import uuid

from api.config import settings
from api.database import init_db
from api.routes.api_v1_routes.api_v1 import api_v1_router
from api.app_logging import logger
from api.middlewares.validate_jwt import validate_jwt

from fastapi import Depends, FastAPI
from fastapi.concurrency import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware


from dotenv import load_dotenv
from starlette.middleware.sessions import SessionMiddleware

load_dotenv()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Initialize the database and manage the lifespan of the app context.
    """
    logger.info("Initializing Database")
    await init_db()
    logger.info("Database Initialized")

    yield


app = FastAPI(lifespan=lifespan)

app.add_middleware(SessionMiddleware, secret_key=uuid.uuid4().hex)


origins = [settings.frontend_url]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(
    api_v1_router,
    tags=["api_v1"],
    prefix="/api/v1",
    dependencies=[Depends(validate_jwt)],
)
