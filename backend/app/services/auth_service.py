# ---------------- Необходимые импорты -------------------
import asyncio
import re
from datetime import timedelta
import secrets
from fastapi import HTTPException
from uuid import uuid4

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from jose import JWTError

from app.schemas.auth import TokenResponse
from app.models.users import User
from app.models.teachers import Teacher
from app.models.failed_logins import FailedLogin
from app.models.user_profiles import UserProfile
from app.models.refresh_sessions import RefreshSession
from app.utils.telegram import send_telegram_message


from app.core.auth_core import (
    now_utc,
    hash_password,
    verify_password,
    calculate_backoff,
    has_min_role,
    has_permission,
    create_access_token,
    create_refresh_token,
    decode_token,
    REFRESH_LIFETIME_DAYS,
    ACCESS_LIFETIME_MINUTES
)


# ---------------- Валидация пароля -------------------

class AuthError(Exception):
    pass


def validate_password(password: str):
    if len(password) < 8:
        raise AuthError("Пароль должен содержать минимум 8 символов")

    if not re.search(r"[a-z]", password):
        raise AuthError("Пароль должен содержать хотя бы одну строчную букву")

    if not re.search(r"[A-Z]", password):
        raise AuthError("Пароль должен содержать хотя бы одну заглавную букву")

    if not re.search(r"\d", password):
        raise AuthError("Пароль должен содержать хотя бы одну цифру")

    if not re.search(r"[!@#$%^&*()_+\-=\[\]{};':\"\\|,.<>\/?]", password):
        raise AuthError("Пароль должен содержать хотя бы один спецсимвол")

    return True


# =========================================================
#                Сервис аутентификации
# =========================================================

class AuthService:

    def __init__(self, session: AsyncSession):
        self.session = session

    # ------------------------ Регистрация ------------------------

    async def register(
            self,
            email: str,
            password: str,
            role: str = "teacher",
            firstname: str | None = None,
            lastname: str | None = None,
            middlename: str | None = None,
            phone: str | None = None,
            age: int | None = None,
            gender: str | None = None,
            specialization: str | None = None,
    ):
        q = await self.session.execute(select(User).where(User.email == email))
        if q.scalars().first():
            raise AuthError("Пользователь уже существует")

        validate_password(password)

        user = User(
            email=email,
            password_hash=hash_password(password),
            role=role,
        )
        self.session.add(user)
        await self.session.flush()

        profile = UserProfile(
            user_id=user.id,
            student_id=None,
            teacher_id=None,
            mentor_id=None,
        )
        self.session.add(profile)

        if role == "teacher":
            if not firstname or not lastname:
                raise AuthError("Имя и фамилия обязательны для учителя")

            fio = f"{lastname} {firstname}" + (f" {middlename}" if middlename else "")

            teacher = Teacher(
                fio=fio,
                specialization=specialization,
                experience=0,
                email=email,
                phone=phone,
                age=age,
                gender=gender,
            )
            self.session.add(teacher)
            await self.session.flush()

            profile.teacher_id = teacher.teacherid

        await self.session.commit()
        return user

    # ------------------------- ВХОД -------------------------

    async def login(self, email: str, password: str):
        q_attempts = await self.session.execute(
            select(func.count(FailedLogin.id)).where(
                FailedLogin.email == email,
                FailedLogin.attempted_at >= now_utc() - timedelta(minutes=15)
            )
        )
        attempts = q_attempts.scalar()

        await asyncio.sleep(calculate_backoff(attempts))

        q_user = await self.session.execute(select(User).where(User.email == email))
        user = q_user.scalars().first()

        if not user or not verify_password(password, user.password_hash):
            self.session.add(FailedLogin(email=email, attempted_at=now_utc()))
            await self.session.commit()
            raise AuthError("Неверный email или пароль")

        access = create_access_token(str(user.id), user.role)
        refresh = create_refresh_token(str(user.id))

        sess = RefreshSession(
            id=uuid4(),
            user_id=user.id,
            token=refresh,
            created_at=now_utc(),
            expires_at=now_utc() + timedelta(days=REFRESH_LIFETIME_DAYS)
        )
        self.session.add(sess)
        await self.session.commit()

        # ---------- Добавляем данные учителя ----------
        teacher_id = None
        firstname = None
        lastname = None

        if user.role == "teacher":
            q = await self.session.execute(
                select(Teacher).where(Teacher.email == user.email)
            )
            teacher = q.scalars().first()

            if teacher:
                teacher_id = teacher.teacherid

                parts = teacher.fio.split()
                if len(parts) >= 2:
                    lastname = parts[0]
                    firstname = parts[1]

        return TokenResponse(
            access=access,
            refresh=refresh,
            role=user.role,
            user_id=str(user.id),
            email=user.email,
            teacher_id=teacher_id,
            firstname=firstname,
            lastname=lastname,
        )

    # ------------------------ REFRESH ------------------------

    async def refresh(self, refresh_token: str):
        # 1. Проверяем подпись JWT
        try:
            data = decode_token(refresh_token)
        except JWTError:
            raise AuthError("Некорректный refresh токен")

        user_id = data.get("sub")

        # 2. Проверяем наличие refresh в БД
        q = await self.session.execute(
            select(RefreshSession).where(RefreshSession.token == refresh_token)
        )
        session_obj = q.scalars().first()

        if not session_obj or session_obj.expires_at < now_utc():
            raise AuthError("Refresh-токен истёк или недействителен")

        # 3. Получаем пользователя
        q_user = await self.session.execute(select(User).where(User.id == user_id))
        user = q_user.scalars().first()

        if not user:
            raise AuthError("Пользователь не найден")

        # 4. Генерируем новый access
        access = create_access_token(str(user.id), user.role)

        return TokenResponse(
            access=access,
            refresh=refresh_token,
            token_type="bearer",
            expires_in=ACCESS_LIFETIME_MINUTES * 60,
            role=user.role,
            user_id=str(user.id),
            email=user.email
        )

    # ------------------------ LOGOUT ------------------------

    async def logout(self, refresh_token: str):

        await self.session.execute(
            RefreshSession.__table__.delete().where(
                RefreshSession.token == refresh_token
            )
        )
        await self.session.commit()

    # ------------------------ ROLE CHECK ------------------------

    async def check_role(self, access_token: str, required_role: str):
        try:
            data = decode_token(access_token)
        except JWTError:
            return False

        role = data.get("role")
        return has_min_role(role, required_role)

    # ------------------------ PERMISSION CHECK ------------------------

    async def check_perm(self, access_token: str, perm: str):
        try:
            data = decode_token(access_token)
        except JWTError:
            return False

        role = data.get("role")
        return has_permission(role, perm)

    async def reset_password(self, email: str, chat_id: str):
        # 1. Проверяем, что пользователь существует
        q = await self.session.execute(select(User).where(User.email == email))
        user = q.scalars().first()

        if not user:
            raise HTTPException(404, "Пользователь с таким email не найден")

        # 2. Генерируем новый временный пароль
        new_password = secrets.token_hex(4)

        # 3. Хэшируем и обновляем пароль
        user.password_hash = hash_password(new_password)
        await self.session.commit()

        # 4. Отправляем пароль в Telegram
        try:
            await send_telegram_message(
                chat_id,
                f"Ваш новый пароль для входа: {new_password}"
            )
        except Exception as e:
            raise HTTPException(500, "Не удалось отправить сообщение в Telegram")

        return True