"""Configuration settings for the server. This settings are loaded from .env"""

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    frontend_url: str
    mongodb_uri: str
    google_client_id: str
    google_client_secret: str


settings = Settings()
