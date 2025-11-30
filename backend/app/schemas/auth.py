from pydantic import BaseModel, EmailStr
from uuid import UUID
from datetime import datetime


class LoginRequest(BaseModel):
    email: str
    password: str


class RegisterRequest(BaseModel):
    firstname: str | None = None
    lastname: str | None = None
    middlename: str | None = None
    email: str  # временно без EmailStr
    phone: str | None = None
    age: int | None = None
    gender: str | None = None
    password: str
    role: str

class TokenResponse(BaseModel):
    token: str
    teacher_id: int | None = None
    firstname: str | None = None
    lastname: str | None = None
    role: str


class RefreshRequest(BaseModel):
    token: str


class LogoutRequest(BaseModel):
    token: str
