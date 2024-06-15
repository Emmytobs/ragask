import uvicorn
from config import ENV_VARS

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=ENV_VARS.port, reload=True)
