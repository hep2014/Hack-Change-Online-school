from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from jose import JWTError
from sqlalchemy import select
from app.schemas.auth import (
    RegisterRequest,
    LoginRequest,
    TokenResponse,
    EmailCheckResponse,
    ResetPasswordRequest,
    LogoutRequest
)
from app.db.session import get_session
from app.services.auth_service import AuthService, AuthError
from app.models.teachers import Teacher
import logging

logger = logging.getLogger("auth")
router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=TokenResponse)
async def register(
    body: RegisterRequest,
    session: AsyncSession = Depends(get_session),
):
    service = AuthService(session)
    try:
        # создаем пользователя
        await service.register(
            firstname=body.firstname,
            lastname=body.lastname,
            middlename=body.middlename,
            email=body.email,
            phone=body.phone,
            age=body.age,
            gender=body.gender,
            password=body.password,
            role=body.role,
            specialization=body.specialization,
        )
        logger.info(
            "User registered successfully",
            extra={"email": body.email, "role": body.role}
        )

        result = await service.login(body.email, body.password)
        # сразу же логиним
        logger.info(
            "User logged in after registration",
            extra={"email": body.email}
        )
        return result
    except AuthError as e:
        logger.error(
            "Registration failed",
            extra={"email": body.email, "error": str(e)}
        )
        raise HTTPException(status_code=401, detail=str(e))


@router.post("/login", response_model=TokenResponse)
async def login(
    body: LoginRequest,
    session: AsyncSession = Depends(get_session)
):
    service = AuthService(session)
    try:
        result = await service.login(body.email, body.password)
        logger.info(
            "User logged in",
            extra={"email": body.email}
        )
        return result
    except AuthError as e:
        logger.warning(
            "Login failed",
            extra={"email": body.email, "error": str(e)}
        )
        raise HTTPException(status_code=401, detail=str(e))


@router.post("/logout")
async def logout(
    body: LogoutRequest,
    session: AsyncSession = Depends(get_session)
):
    """
    Логаут = удаление refresh-токена из таблицы refresh_sessions.
    Access-токен просто истечет сам.
    """
    service = AuthService(session)
    try:
        await service.logout(body.token)
        logger.info(
            "User logged out",
            extra={"token": body.token[:10] + "..."}
        )
        return {"status": "ok"}
    except JWTError:
        logger.error("Invalid token on logout")
        raise HTTPException(400, "Invalid token")

@router.get("/check-email", response_model=EmailCheckResponse)
async def check_email(email: str, session: AsyncSession = Depends(get_session)):
    q = await session.execute(select(Teacher).where(Teacher.email == email))
    exists = q.scalars().first() is not None
    return {"exists": bool(exists)}

@router.post("/reset-password")
async def reset_password(
    body: ResetPasswordRequest,
    session: AsyncSession = Depends(get_session)
):
    service = AuthService(session)
    await service.reset_password(body.email, body.chat_id)
    return {"status": "ok"}

