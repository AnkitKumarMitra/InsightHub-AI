print(">>> App import started")
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.auth import router as auth_router
from app.api.query import router as query_router
from app.api.documents import router as documents_router

print(">>> App created")
app = FastAPI()


@app.on_event("startup")
def startup_event():
    from app.infrastructure.embeddings import embedding_service
    embedding_service.load_model()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "ok"}

app.include_router(auth_router, prefix="/auth", tags=["Auth"])
app.include_router(query_router, prefix="/query", tags=["Query"])
app.include_router(documents_router, prefix="/documents", tags=["Documents"])