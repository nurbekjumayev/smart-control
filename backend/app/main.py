from fastapi import FastAPI, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import datetime
import json
from .services import audit, mutual_aid

app = FastAPI(title="Aqlli Nazorat Backend")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Shared Tasks (Simulated DB)
class Task(BaseModel):
    id: str
    title: str
    priority: str # High, Medium, Low
    status: str # Backlog, Todo, InProgress, Review, Done
    assigned_to: str
    helper_id: Optional[str] = None
    deadline: datetime.datetime
    created_at: datetime.datetime = datetime.datetime.utcnow()
    total_time_spent_mins: int = 0
    is_risk: bool = False

TASKS: List[Task] = []

@app.post("/tasks/")
async def create_task(task: Task):
    TASKS.append(task)
    audit.log_action(task.assigned_to, "CREATE_TASK", task.dict())
    return task

@app.patch("/tasks/{task_id}/status")
async def update_status(task_id: str, status: str, user_id: str):
    task = next((t for t in TASKS if t.id == task_id), None)
    if not task:
        raise HTTPException(status_code=404)
    
    old_status = task.status
    task.status = status
    
    # Priority Lock: If status changed to InProgress and task is High priority,
    # and already has another InProgress task, pause it.
    if status == "InProgress" and task.priority == "High":
        # Simulate logic: Find other 'InProgress' tasks by same user and pause them.
        for other in TASKS:
            if other.id != task_id and other.assigned_to == user_id and other.status == "InProgress":
                other.status = "Paused"
                audit.log_action("System", "PRIORITY_LOCK_PAUSE", {"paused_task": other.id, "active_task": task_id})

    audit.log_action(user_id, "STATUS_CHANGE", {"task": task_id, "old": old_status, "new": status})
    return task

@app.get("/mutual-aid/suggest/{user_id}")
async def suggest_helper(user_id: str):
    helper = mutual_aid.find_best_helper(user_id)
    if not helper:
        return {"suggested": None, "message": "No eligible helper found"}
    return {"suggested": helper}

@app.get("/audit/logs")
async def get_logs():
    # Only for Manager role (simulated check)
    try:
        with open("audit_log.jsonl", "r", encoding="utf-8") as f:
            lines = f.readlines()
            return [json.loads(l) for l in lines]
    except FileNotFoundError:
        return []

# Background loop simulation for Smart Deadline
@app.on_event("startup")
async def check_deadlines():
    """
    In a real system, this would be a CRON job or a Celery beat task.
    """
    now = datetime.datetime.utcnow()
    for task in TASKS:
        if task.status != "Done":
            total_duration = task.deadline - task.created_at
            elapsed = now - task.created_at
            if elapsed / total_duration >= 0.8:
                task.is_risk = True
                # Log this as risk
                # In real: Send telegram notification!
                audit.log_action("System", "SMART_DEADLINE_RISK", {"task": task.id})
