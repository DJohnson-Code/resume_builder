from fastapi import FastAPI
from routes.routes import router as resume_router 

app = FastAPI(title="Resume Builder API")

app.include_router(resume_router)

@app.get("/api/health")
def health():
    """
    Health check endpoint.
    """
    return {"status": "ok"}

@app.get("/")
def root():
    return {"message": "Resume Builder API running"}