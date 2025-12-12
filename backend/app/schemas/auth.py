from pydantic import BaseModel


class LoginRequest(BaseModel):
    email: str
    password: str


class RegisterRequest(BaseModel):
    firstname: str | None = None
    lastname: str | None = None
    middlename: str | None = None
    email: str
    phone: str | None = None
    age: int | None = None
    gender: str | None = None
    password: str
    role: str
    specialization: str | None = None

class TokenResponse(BaseModel):
    access: str
    refresh: str
    role: str
    user_id: str
    email: str
    teacher_id: int | None = None
    firstname: str | None = None
    lastname: str | None = None

    model_config = {
        "from_attributes": True
    }


class RefreshRequest(BaseModel):
    token: str


class LogoutRequest(BaseModel):
    token: str

class EmailCheckResponse(BaseModel):
    exists: bool

class ResetPasswordRequest(BaseModel):
    email: str
    chat_id: str


