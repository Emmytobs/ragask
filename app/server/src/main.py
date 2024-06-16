import uvicorn
from src.config import ENV_VARS


def start_server():
    uvicorn.run("src.app:app", host="0.0.0.0", port=ENV_VARS.port, reload=True)
