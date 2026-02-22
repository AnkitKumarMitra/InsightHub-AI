from openai import OpenAI
from typing import Optional

from app.core.config import settings


class GroqClient:

    def __init__(
        self,
        model: Optional[str] = None,
        temperature: float = 0.2,
        max_tokens: int = 512,
    ):
        self.client = OpenAI(
            api_key=settings.GROQ_API_KEY,
            base_url="https://api.groq.com/openai/v1",
        )

        self.model = model or settings.GROQ_MODEL
        self.temperature = temperature
        self.max_tokens = max_tokens

    def generate(self, prompt: str) -> str:

        response = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a helpful assistant that answers questions "
                        "using the provided context. If the context is insufficient, "
                        "say you do not know."
                    ),
                },
                {"role": "user", "content": prompt},
            ],
            temperature=self.temperature,
            max_tokens=self.max_tokens,
        )

        return response.choices[0].message.content.strip()