import uvicorn
from config import ENV_VARS


def start_server():
    uvicorn.run("app:app", host="0.0.0.0", port=ENV_VARS.port, reload=True)
