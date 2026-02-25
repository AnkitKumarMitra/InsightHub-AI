from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.auth import router as auth_router
from app.api.query import router as query_router
from app.api.documents import router as documents_router
from app.core.config import settings

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
print("CORS FRONTEND URL:", settings.FRONTEND_URL)

@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "ok"}

app.include_router(auth_router, prefix="/auth", tags=["Auth"])
app.include_router(query_router, prefix="/query", tags=["Query"])
app.include_router(documents_router, prefix="/documents", tags=["Documents"])