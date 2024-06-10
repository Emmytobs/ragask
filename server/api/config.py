"""Configuration settings for the server"""

from pydantic_settings import BaseSettings


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

    port: int = 8000


ENV_VARS = Settings()
