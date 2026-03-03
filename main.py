import logging

from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
from fastapi import FastAPI
from routes.routes import router as resume_router 

app = FastAPI(title="Resume Builder API")

app.include_router(resume_router)

@app.get("/api/health")
async def health():
    """
    Health check endpoint.
    """
    return {"status": "ok"}

@app.get("/")
async def root():
    return {"message": "Resume Builder API running"}
