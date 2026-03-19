from pydantic import BaseModel
from typing import List, Optional

class User(BaseModel):
    id: str
    name: str
    role: str
    energy_level: int
    avatar: str

# Local "DB" for simulation
USERS = [
    User(id="u1", name="Alisher Navoiy", role="Manager", energy_level=45, avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Alisher"),
    User(id="u2", name="Bobur Mirzo", role="Senior", energy_level=85, avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Bobur"),
    User(id="u3", name="Amir Temur", role="Senior", energy_level=20, avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Amir"),
    User(id="u4", name="Ulugbek Mirzo", role="Junior", energy_level=65, avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Ulugbek"),
    User(id="u5", name="Mashrab", role="Junior", energy_level=10, avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Mashrab"),
    User(id="u6", name="Zulfiya", role="Senior", energy_level=90, avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Zulfiya"),
    User(id="u7", name="Gofur Gulyom", role="Junior", energy_level=30, avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Gofur"),
]

def find_best_helper(exclude_id: str) -> Optional[User]:
    """
    Search for the least busy specialist except for the requester and manager.
    """
    eligible = [u for u in USERS if u.id != exclude_id and u.role != "Manager"]
    if not eligible:
        return None
    # Sort by energy level (workload) ascending
    return min(eligible, key=lambda u: u.energy_level)
