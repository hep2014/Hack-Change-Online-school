from datetime import datetime, timedelta
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError
from jose import jwt
import os
from dotenv import load_dotenv
from pathlib import Path
BASE_DIR = Path(__file__).resolve().parents[2]
ENV_PATH = BASE_DIR.parent / ".env"
load_dotenv(ENV_PATH)

# -----------------------------
# PASSWORD HASHER
# -----------------------------

ph = PasswordHasher(
    time_cost=int(os.getenv("ARGON2_TIME_COST")),
    memory_cost=int(os.getenv("ARGON2_MEMORY_COST")),
    parallelism=int(os.getenv("ARGON2_PARALLELISM")),
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


# -----------------------------
# ROLES
# -----------------------------

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


# -----------------------------
# JWT SECTION
# -----------------------------

JWT_SECRET = os.getenv("SECRET_KEY")
JWT_ALG = os.getenv("HASH_SCHEME") #
ACCESS_LIFETIME_MINUTES = 15
REFRESH_LIFETIME_DAYS = 7


def create_access_token(user_id: str, role: str):
    now = now_utc()
    payload = {
        "sub": user_id,
        "role": role,
        "iat": now,
        "exp": now + timedelta(minutes=ACCESS_LIFETIME_MINUTES)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALG)


def create_refresh_token(user_id: str):
    now = now_utc()
    payload = {
        "sub": user_id,
        "iat": now,
        "exp": now + timedelta(days=REFRESH_LIFETIME_DAYS)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALG)


def decode_token(token: str):
    """
    Универсальная верификация access/refresh.
    Ловим ошибки — outside.
    """
    return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALG])
