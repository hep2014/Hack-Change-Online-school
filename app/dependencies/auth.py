from fastapi import Header, HTTPException, status, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime

from app.db.session import get_session
from app.models.sessions import Session


async def get_current_user_id(
    authorization: str = Header(None),  # ждём "Bearer <token>"
    session: AsyncSession = Depends(get_session),
) -> str:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Отсутствует токен авторизации")

    token = authorization.split(" ", 1)[1]

    q = await session.execute(select(Session).where(Session.token == token))
    sess = q.scalars().first()

    if not sess or sess.expires_at < datetime.utcnow():
        raise HTTPException(status_code=401, detail="Недействительная сессия")

    return str(sess.user_id)


from app.models.user_profiles import UserProfile

async def get_current_teacher_id(
    user_id: str = Depends(get_current_user_id),
    session: AsyncSession = Depends(get_session),
) -> int | None:
    q = await session.execute(
        select(UserProfile.teacher_id).where(UserProfile.user_id == user_id)
    )
    return q.scalar()  # может быть None
