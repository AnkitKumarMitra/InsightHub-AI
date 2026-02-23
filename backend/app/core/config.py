from dotenv import load_dotenv
import os

load_dotenv()


class Settings:
    APP_NAME: str = "RAG Knowledge Base API"

    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "change_me")
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
    JWT_EXPIRE_MINUTES: int = int(os.getenv("JWT_EXPIRE_MINUTES", 60))

    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    GROQ_MODEL: str = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")

    FRONTEND_URL: str = os.getenv("FRONTEND_URL")
    DATABASE_URL: str = os.getenv("DATABASE_URL")


settings = Settings()