from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from typing import Optional


class TeacherService:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def _set_user(self, user_id: str):
        """Устанавливает текущего пользователя в контекст БД."""
        await self.session.execute(
            text("SELECT set_config('app.user_id', :uid, false)"),
            {"uid": user_id},
        )

    async def get_stats(self, user_id: Optional[str]):
        if not user_id:
            return {
                "activeCourses": 0,
                "students": 0,
                "worksToCheck": 0,
                "avgPerformance": None,
            }

        # Обязательно выставляем user_id **до запросов**
        print("DEBUG USER:", user_id, type(user_id))
        await self._set_user(user_id)

        # Количество активных курсов
        active_courses = (
            await self.session.execute(
                text("SELECT COUNT(DISTINCT courseid) FROM app.teacher_view")
            )
        ).scalar() or 0

        # Количество студентов
        students = (
            await self.session.execute(
                text("SELECT COUNT(DISTINCT studentid) FROM app.teacher_view")
            )
        ).scalar() or 0

        # Работ на проверке (где оценка NULL)
        works_to_check = (
            await self.session.execute(
                text("SELECT COUNT(*) FROM app.teacher_view WHERE grade IS NULL")
            )
        ).scalar() or 0

        # Средняя оценка (где оценка не NULL)
        avg_performance = (
            await self.session.execute(
                text("SELECT AVG(grade) FROM app.teacher_view WHERE grade IS NOT NULL")
            )
        ).scalar()

        return {
            "activeCourses": active_courses,
            "students": students,
            "worksToCheck": works_to_check,
            "avgPerformance": round(avg_performance, 2) if avg_performance else None,
        }
