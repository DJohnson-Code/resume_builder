from __future__ import annotations
from models import ResumeOut
from config import settings 
from openai import OpenAI
from services.prompts import build_resume_prompt


class AIService: 
    def __init__(self): 
        if not settings.OPENAI_API_KEY: 
            raise ValueError("OPENAI_API_KEY is not configured.")

        self.api_key = settings.OPENAI_API_KEY
        self.gpt_model = settings.OPENAI_MODEL
        self.client = OpenAI(api_key=self.api_key)

    def generate_resume(self, cleaned: ResumeOut) -> dict: 
        prompt = build_resume_prompt(cleaned)
        

