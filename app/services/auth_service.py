import asyncio
from datetime import timedelta
from uuid import uuid4

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.schemas.auth import TokenResponse
from app.models.users import User
from app.models.teachers import Teacher
from app.models.sessions import Session
from app.models.failed_logins import FailedLogin

from app.core.auth_core import (
    now_utc,
    hash_password,
    verify_password,
    calculate_backoff,
    has_min_role,
    has_permission
)
import re



from sqlalchemy import select
from app.models.users import User
from app.models.teachers import Teacher
from app.models.user_profiles import UserProfile



def validate_password(password: str):
    if len(password) < 8:
        raise AuthError("Пароль должен содержать минимум 8 символов")

    if not re.search(r"[a-z]", password):
        raise AuthError("Пароль должен содержать хотя бы одну строчную букву (a-z)")

    if not re.search(r"[A-Z]", password):
        raise AuthError("Пароль должен содержать хотя бы одну заглавную букву (A-Z)")

    if not re.search(r"\d", password):
        raise AuthError("Пароль должен содержать хотя бы одну цифру")

    if not re.search(r"[!@#$%^&*()_+\-=\[\]{};':\"\\|,.<>\/?]", password):
        raise AuthError("Пароль должен содержать хотя бы один специальный символ")

    return True


SESSION_LIFETIME_DAYS = 30


class AuthError(Exception):
    pass


class AuthService:
    """
    Полностью обновлённый сервис аутентификации.
    Работает исключительно через ORM.
    """

    def __init__(self, session: AsyncSession):
        self.session = session

    # ---------------- Registration ----------------
    async def register(
            self,
            email: str,
            password: str,
            role: str = "student",
            firstname: str | None = None,
            lastname: str | None = None,
            middlename: str | None = None,
            phone: str | None = None,  # не используем пока
            age: int | None = None,  # не используем пока
            gender: str | None = None,  # не используем пока
    ):
        q = await self.session.execute(select(User).where(User.email == email))
        existing = q.scalars().first()
        if existing:
            raise AuthError("Пользователь уже существует")

        # 1. Создаём сам аккаунт
        user = User(
            email=email,
            password_hash=hash_password(password),
            role=role,
        )
        self.session.add(user)
        await self.session.flush()

        # 2. Создаём профиль (teacher_id позже заполним)
        profile = UserProfile(
            user_id=user.id,
            teacher_id=None,
        )
        self.session.add(profile)

        # 3. Если преподаватель — создаём Teacher
        if role == "teacher":
            if not firstname or not lastname:
                raise AuthError("Имя и фамилия обязательны для регистрации преподавателя")

            fio = f"{lastname} {firstname}" + (f" {middlename}" if middlename else "")

            teacher = Teacher(
                fio=fio,
                specialization="Не указана",
                experience=0,
                email=email,
            )
            self.session.add(teacher)
            await self.session.flush()

            profile.teacher_id = teacher.teacherid

        await self.session.commit()
        await self.session.refresh(user)
        return user

    # ---------------- Authentication ----------------
    async def login(self, email: str, password: str):
        # backoff
        q_attempts = await self.session.execute(
            select(func.count(FailedLogin.id)).where(
                FailedLogin.email == email,
                FailedLogin.attempted_at >= now_utc() - timedelta(minutes=15)
            )
        )
        attempts = q_attempts.scalar()
        await asyncio.sleep(calculate_backoff(attempts))

        # ищем пользователя
        q_user = await self.session.execute(select(User).where(User.email == email))
        user = q_user.scalars().first()

        if not user or not verify_password(password, user.password_hash):
            self.session.add(FailedLogin(email=email, attempted_at=now_utc()))
            await self.session.commit()
            raise AuthError("Неверный email или пароль")

        # создаём сессию
        token = uuid4()
        expires_at = now_utc() + timedelta(days=SESSION_LIFETIME_DAYS)

        sess = Session(
            token=token,
            user_id=user.id,
            created_at=now_utc(),
            expires_at=expires_at,
        )

        self.session.add(sess)
        await self.session.commit()
        await self.session.refresh(sess)

        return {
            "token": str(sess.token),
            "user_id": str(user.id),
            "email": user.email,
            "role": user.role,
            "expires_at": sess.expires_at,
        }

    # ---------------- Refresh ----------------
    async def refresh(self, token: str):
        q = await self.session.execute(select(Session).where(Session.token == token))
        sess = q.scalars().first()

        if not sess or sess.expires_at < now_utc():
            return None

        sess.expires_at = now_utc() + timedelta(days=SESSION_LIFETIME_DAYS)
        await self.session.commit()

        await self.session.refresh(sess)
        return sess

    # ---------------- Logout ----------------
    async def logout(self, token: str):
        await self.session.execute(
            Session.__table__.delete().where(Session.token == token)
        )
        await self.session.commit()

    # ---------------- Role check ----------------
    async def check_role(self, token: str, required_role: str):
        # достаём сессию
        q = await self.session.execute(select(Session).where(Session.token == token))
        sess = q.scalars().first()

        if not sess or sess.expires_at < now_utc():
            return False

        q_user = await self.session.execute(
            select(User).where(User.id == sess.user_id)
        )
        user = q_user.scalars().first()

        return user and has_min_role(user.role, required_role)

    # ---------------- Permission check ----------------
    async def check_perm(self, token: str, perm: str):
        q = await self.session.execute(select(Session).where(Session.token == token))
        sess = q.scalars().first()

        if not sess or sess.expires_at < now_utc():
            return False

        q_user = await self.session.execute(
            select(User).where(User.id == sess.user_id)
        )
        user = q_user.scalars().first()

        return user and has_permission(user.role, perm)
