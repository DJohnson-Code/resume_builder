from __future__ import annotations
from models import ResumeOut
from config import settings 
from openai import OpenAI
import os

api_key = settings.OPENAI_API_KEY
gpt_model = settings.OPENAI_MODEL


class AIService: 
    def __init__(self): 
        self.api_key = settings.OPENAI_API_KEY
        self.gpt_model = settings.OPENAI_MODEL
        self.client = OpenAI(api_key=self.api_key)

    def generate_ai_content(self, resume: ResumeOut) -> str:
        prompt = f"""
        Given the following resume information, please generate an enhanced summary or additional content.
        Resume: {resume.model_dump_json()}
        """
        
        chat_completion = self.client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            model=self.gpt_model,
        )
        return chat_completion.choices[0].message.content