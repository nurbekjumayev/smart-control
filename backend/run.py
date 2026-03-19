import uvicorn
from app.database import engine, Base
from app.models import User, Task, AuditLog

def setup_database():
    # Create all tables if they don't exist
    print("Malu'motlar bazasi tekshirilmoqda...")
    Base.metadata.create_all(bind=engine)
    print("Malu'motlar bazasi muvaffaqiyatli ulangan!")

if __name__ == "__main__":
    setup_database()
    # Runs the FastAPI server on localhost:8000
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
