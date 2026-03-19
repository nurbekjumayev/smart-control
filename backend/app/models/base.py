from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
import datetime
import uuid
from ..database import Base

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, index=True)
    role = Column(String)  # Manager, Senior, Junior
    energy_level = Column(Integer, default=0)
    avatar = Column(String, nullable=True)
    telegram_id = Column(String, unique=True, nullable=True)

    # Relationships
    tasks_assigned = relationship("Task", foreign_keys="Task.assigned_to", back_populates="assignee")
    tasks_helping = relationship("Task", foreign_keys="Task.helper_id", back_populates="helper")

class Task(Base):
    __tablename__ = "tasks"

    id = Column(String, primary_key=True, default=generate_uuid)
    title = Column(String, index=True)
    description = Column(String, nullable=True)
    priority = Column(String, default="Medium")  # High, Medium, Low
    status = Column(String, default="Todo")      # Backlog, Todo, InProgress, Review, Done
    
    assigned_to = Column(String, ForeignKey("users.id"))
    helper_id = Column(String, ForeignKey("users.id"), nullable=True)
    
    deadline = Column(DateTime)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    total_time_spent_mins = Column(Integer, default=0)
    is_risk = Column(Boolean, default=False)

    # Hierarchical structure for dependency
    parent_id = Column(String, ForeignKey("tasks.id"), nullable=True)

    # Relationships
    assignee = relationship("User", foreign_keys=[assigned_to], back_populates="tasks_assigned")
    helper = relationship("User", foreign_keys=[helper_id], back_populates="tasks_helping")
    
    parent = relationship("Task", remote_side=[id], backref="subtasks")

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, index=True)
    action = Column(String, index=True)
    details = Column(String) # JSON payload mapping
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    ip_address = Column(String, default="127.0.0.1")
    hash = Column(String) # For immutable chain proof
