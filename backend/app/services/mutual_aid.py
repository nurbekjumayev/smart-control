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
    User(id="u1", name="Xamrayev Omon", role="Manager", energy_level=0, avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Omon"),
    User(id="u2", name="Jumayev Nurbek", role="Manager", energy_level=0, avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Nurbek"),
    User(id="u3", name="Qosimov Elbek", role="Senior", energy_level=0, avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Elbek"),
    User(id="u4", name="Xojibayev Javoxit", role="Junior", energy_level=0, avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Javoxit"),
    User(id="u5", name="Ismoilov Xasan", role="Junior", energy_level=0, avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Xasan"),
    User(id="u6", name="Xo'jamqulov Baxtiyor", role="Junior", energy_level=0, avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Baxtiyor"),
    User(id="u7", name="Ismatov Temur", role="Junior", energy_level=0, avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Temur"),
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
