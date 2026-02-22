import faiss
import pickle

index = faiss.read_index("faiss.index")
print("Vectors in index file:", index.ntotal)

with open("faiss.index.meta", "rb") as f:
    metadata = pickle.load(f)
print("Metadata entries:", len(metadata))