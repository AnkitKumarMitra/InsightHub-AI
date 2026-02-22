from sentence_transformers import SentenceTransformer

class EmbeddingService:
    def __init__(self):
        self.model = None

    def load_model(self):
        if self.model is None:
            self.model = SentenceTransformer("all-MiniLM-L6-v2")

    def embed_text(self, text: str):
        if self.model is None:
            self.load_model()
        return self.model.encode(text).tolist()


embedding_service = EmbeddingService()