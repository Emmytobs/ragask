"""Module for initializing the FastAPI application and including routers."""

import os
import uuid


from fastapi import Depends, FastAPI
from fastapi.concurrency import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware

from dotenv import load_dotenv
from starlette.middleware.sessions import SessionMiddleware

from src.config import ENV_VARS
from src.database import init_db
from src.api import api_v1_router
from src.app_logging import logger
from src.users.service import validate_jwt

load_dotenv()

base_dir = os.path.dirname(os.path.abspath(__file__))

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = os.path.join(
    base_dir, ENV_VARS.google_service_account
)

os.environ["LANGCHAIN_TRACING_V2"] = "true"
os.environ["LANGCHAIN_API_KEY"] = ENV_VARS.langchain_api_key
os.environ["LANGCHAIN_PROJECT"] = ENV_VARS.langchain_project


@asynccontextmanager
async def lifespan(fastapi_app: FastAPI):
    """
    Initialize the database and manage the lifespan of the app context.
    """
    logger.info("Initializing Database")
    await init_db()
    logger.info("Database Initialized")

    yield


app = FastAPI(lifespan=lifespan)

app.add_middleware(SessionMiddleware, secret_key=uuid.uuid4().hex)


origins = [ENV_VARS.frontend_url]
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
