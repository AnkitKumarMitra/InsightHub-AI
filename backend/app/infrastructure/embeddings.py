import os
import requests
from typing import List
from app.core.config import Settings

JINA_EMBEDDING_MODEL = "jina-embeddings-v2-base-en"
JINA_API_URL = "https://api.jina.ai/v1/embeddings"


class EmbeddingService:
    def __init__(self):
        api_key = Settings.JINA_API_TOKEN
        if not api_key:
            raise RuntimeError("JINA_API_KEY environment variable not set")

        self.headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        }

    def embed_text(self, text: str) -> List[float]:
        response = requests.post(
            JINA_API_URL,
            headers=self.headers,
            json={
                "model": JINA_EMBEDDING_MODEL,
                "input": text
            },
            timeout=30,
        )

        response.raise_for_status()

        data = response.json()

        embedding = data["data"][0]["embedding"]

        return embedding
    
    def embed_texts(self, texts: List[str]) -> List[List[float]]:
        response = requests.post(
            JINA_API_URL,
            headers=self.headers,
            json={
                "model": JINA_EMBEDDING_MODEL,
                "input": texts
            },
            timeout=60,
        )

        response.raise_for_status()
        data = response.json()

        return [item["embedding"] for item in data["data"]]