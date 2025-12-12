from fastapi import Header, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from jose import JWTError

from app.db.session import get_session
from app.core.auth_core import decode_token
from app.models.user_profiles import UserProfile


# ----------------------------------------------------------
#   Извлечение текущего user_id из JWT access-токена
# ----------------------------------------------------------
async def get_current_user_id(
    authorization: str = Header(None),
) -> str:

    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Отсутствует токен авторизации")

    token = authorization.split(" ", 1)[1]

    try:
        payload = decode_token(token)
    except JWTError:
        raise HTTPException(status_code=401, detail="Некорректный или истёкший токен")

    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Некорректный токен: отсутствует user_id")

    return user_id


# ----------------------------------------------------------
#   Возвращает teacher_id, если он есть
# ----------------------------------------------------------
async def get_current_teacher_id(
    user_id: str = Depends(get_current_user_id),
    session: AsyncSession = Depends(get_session),
) -> int | None:

    q = await session.execute(
        select(UserProfile.teacher_id).where(UserProfile.user_id == user_id)
    )
    return q.scalar()
