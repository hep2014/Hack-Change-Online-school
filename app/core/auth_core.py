# app/core/auth_core.py

from datetime import datetime
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError

ph = PasswordHasher(
    time_cost=3,
    memory_cost=65536,
    parallelism=4,
)

MAX_BACKOFF_SECONDS = 300


def now_utc():
    return datetime.utcnow()


def hash_password(plain: str) -> str:
    return ph.hash(plain)


def verify_password(plain: str, hashed: str) -> bool:
    try:
        return ph.verify(hashed, plain)
    except VerifyMismatchError:
        return False


def calculate_backoff(attempts: int) -> int:
    if attempts <= 0:
        return 0
    return min(2 ** attempts, MAX_BACKOFF_SECONDS)


ROLE_LEVELS = {"student": 1, "teacher": 2, "admin": 3}

ROLE_PERMISSIONS = {
    "student": {"view_self", "view_courses"},
    "teacher": {"view_self", "view_courses", "edit_grades"},
    "admin": {"view_self", "view_courses", "edit_grades", "manage_users", "view_audit"},
}


def has_min_role(role: str, required: str) -> bool:
    return ROLE_LEVELS.get(role, 0) >= ROLE_LEVELS.get(required, 0)


def has_permission(role: str, perm: str) -> bool:
    return perm in ROLE_PERMISSIONS.get(role, set())
