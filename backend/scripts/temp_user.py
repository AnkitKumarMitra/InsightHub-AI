from app.db.session import SessionLocal
from app.db.models import User
from app.core.security import hash_password

db = SessionLocal()

user = User(
    email="admin@example.com",
    name="Admin Kumar",
    hashed_password=hash_password("admin123")
)

db.add(user)
db.commit()
db.close()

print("User created")