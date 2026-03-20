import hashlib
import json
import datetime
from sqlalchemy.orm import Session
from ..models.base import AuditLog

def log_action(user_id: str, action: str, details: dict, db: Session):
    prev_log = db.query(AuditLog).order_by(AuditLog.id.desc()).first()
    prev_hash = prev_log.hash if prev_log else "0"
    
    # Create Immutable Hash
    log_content = f"{user_id}{action}{json.dumps(details)}{prev_hash}"
    current_hash = hashlib.sha256(log_content.encode()).hexdigest()
    
    new_log = AuditLog(
        user_id=user_id,
        action=action,
        details=json.dumps(details),
        hash=current_hash
    )
    db.add(new_log)
    db.commit()
    print(f"[AUDIT] {user_id} performed {action}")
