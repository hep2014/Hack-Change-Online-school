from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.schemas.auth import RegisterRequest, LoginRequest, TokenResponse
from app.db.session import get_session
from app.services.auth_service import AuthService, AuthError

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=TokenResponse)
async def register(
    body: RegisterRequest,
    session: AsyncSession = Depends(get_session),
):
    service = AuthService(session)

    # 1. Регистрируем пользователя (и сразу создаём Teacher при необходимости)
    await service.register(
        firstname=body.firstname,
        lastname=body.lastname,
        middlename=body.middlename,
        email=body.email,
        phone=body.phone,
        age=body.age,
        gender=body.gender,
        password=body.password,
        role=body.role
    )

    # 2. Сразу авторизуем, чтобы вернуть токен
    return await service.login(body.email, body.password)


@router.post("/login", response_model=TokenResponse)
async def login(
    body: LoginRequest,
    session: AsyncSession = Depends(get_session)
):
    service = AuthService(session)
    try:
        return await service.login(body.email, body.password)
    except AuthError as e:
        raise HTTPException(401, str(e))


@router.post("/logout")
async def logout(
    token: str,
    session: AsyncSession = Depends(get_session)
):
    service = AuthService(session)
    await service.logout(token)
    return {"status": "ok"}
