from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_session
from app.services.teacher_service import TeacherService
from app.schemas.stats import TeacherStatsOut
from app.dependencies.auth import get_current_user_id

router = APIRouter(prefix="/teacher", tags=["teacher"])

@router.get("/stats", response_model=TeacherStatsOut)
async def get_teacher_stats(
    user_id: str = Depends(get_current_user_id),
    session: AsyncSession = Depends(get_session),
):
    service = TeacherService(session)
    return await service.get_stats(user_id)