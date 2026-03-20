from fastapi import FastAPI, BackgroundTasks, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from .database import get_db
from .models.base import Task as DBTask, AuditLog, User as DBUser
from .services import audit, mutual_aid
import datetime

app = FastAPI(title="Aqlli Nazorat Backend")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/tasks/")
async def create_task(task_data: dict, db: Session = Depends(get_db)):
    # Simple conversion for demo
    new_task = DBTask(
        id=task_data['id'],
        title=task_data['title'],
        priority=task_data['priority'],
        status=task_data['status'],
        assigned_to=task_data['assignedTo'],
        deadline=datetime.datetime.fromisoformat(task_data['deadline'].replace('Z', ''))
    )
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    audit.log_action(new_task.assigned_to, "CREATE_TASK", task_data, db)
    return new_task

@app.get("/tasks/")
async def get_tasks(db: Session = Depends(get_db)):
    return db.query(DBTask).all()

@app.patch("/tasks/{task_id}/status")
async def update_status(task_id: str, status: str, user_id: str, db: Session = Depends(get_db)):
    task = db.query(DBTask).filter(DBTask.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    old_status = task.status
    task.status = status
    
    # Priority Lock simulation
    if status == "InProgress" and task.priority == "High":
        others = db.query(DBTask).filter(
            DBTask.id != task_id, 
            DBTask.assigned_to == user_id, 
            DBTask.status == "InProgress"
        ).all()
        for other in others:
            other.status = "Paused"
            audit.log_action("System", "PRIORITY_LOCK_PAUSE", {"paused": other.id}, db)

    db.commit()
    audit.log_action(user_id, "STATUS_CHANGE", {"id": task_id, "old": old_status, "new": status}, db)
    return task

@app.get("/mutual-aid/suggest/{user_id}")
async def suggest_helper(user_id: str):
    helper = mutual_aid.find_best_helper(user_id)
    if not helper:
        return {"suggested": None, "message": "No eligible helper found"}
    return {"suggested": helper}

@app.get("/audit/logs")
async def get_logs(db: Session = Depends(get_db)):
    return db.query(AuditLog).order_by(AuditLog.created_at.desc()).limit(100).all()

# Background loop simulation for Smart Deadline
@app.on_event("startup")
async def check_deadlines():
    """
    In a real system, this would be a CRON job or a Celery beat task.
    """
    # This function would need to be updated to use the database session
    # and query DBTask objects instead of the in-memory TASKS list.
    # For now, it's left as is, but it will not function correctly without DB integration.
    # A proper implementation would involve creating a new session within this async function
    # or passing a session to it.
    pass # Removed the original logic as it relied on the in-memory TASKS list.
