"""Configuration settings for the server"""

from pydantic_settings import BaseSettings
from os import path


class Settings(BaseSettings):
    """These settings are loaded from .env"""

    frontend_url: str

    mongodb_uri: str

    # oauth
    google_client_id: str
    google_client_secret: str

    # google cloud storage
    google_bucket_project_id: str
    google_bucket_name: str
    google_service_account: str

    openai_api_key: str

    port: int

    langchain_api_key: str
    langchain_project: str = "ragask"


env_var_file_path = path.join(path.dirname(__file__), ".env")
ENV_VARS = Settings(_env_file=env_var_file_path, _env_file_encoding='utf-8')
