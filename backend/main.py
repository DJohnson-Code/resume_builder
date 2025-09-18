from fastapi import FastAPI
from models import ResumeIn, ResumeOut
from validations import split_skills

app = FastAPI(title="Resume Builder API")


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.post("/api/resume/validate", response_model=ResumeOut)
def validate_resume(payload: ResumeIn):
    skills = split_skills(payload.skills)
    return {"ok": True, "normalized_skills": skills}