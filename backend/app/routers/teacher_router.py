from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.responses import FileResponse
from app.db.session import get_session
from app.dependencies.auth import get_current_teacher_id
from app.services.teacher_service import TeacherService
from app.schemas.assignments import AssignmentCreate, AssignmentOut
from app.schemas.results import ResultCreate, ResultOut
from app.schemas.teachers import TeacherOut


router = APIRouter(prefix="/teacher", tags=["teacher"])


@router.get("/stats")
async def get_teacher_stats(
    teacher_id: int = Depends(get_current_teacher_id),
    session: AsyncSession = Depends(get_session),
):
    if teacher_id is None:
        raise HTTPException(403, "Доступ разрешён только преподавателям")

    service = TeacherService(session)
    stats = await service.get_teacher_stats(teacher_id)

    return {
        "teacher_id": teacher_id,
        "stats": stats,
    }

@router.post("/assignments/create", response_model=AssignmentOut)
async def create_assignment(
    body: AssignmentCreate,
    teacher_id: int = Depends(get_current_teacher_id),
    session: AsyncSession = Depends(get_session)
):
    if teacher_id is None:
        raise HTTPException(403, "Только преподаватели могут создавать задания")

    service = TeacherService(session)
    assignment = await service.create_assignment(teacher_id, body)

    return assignment

@router.get("/assignments/{assignment_id}/file")
async def download_assignment_file(
    assignment_id: int,
    teacher_id: int = Depends(get_current_teacher_id),
    session: AsyncSession = Depends(get_session),
):
    service = TeacherService(session)
    file_obj = await service.get_assignment_file(teacher_id, assignment_id)

    return FileResponse(
        path=file_obj.file_path,
        media_type=file_obj.mime_type or "application/octet-stream",
        filename=file_obj.original_name
    )

@router.post("/assignments/result", response_model=ResultOut)
async def set_assignment_result(
    body: ResultCreate,
    teacher_id: int = Depends(get_current_teacher_id),
    session: AsyncSession = Depends(get_session)
):
    if teacher_id is None:
        raise HTTPException(403, "Только преподаватели могут выставлять оценки")

    service = TeacherService(session)
    result = await service.set_assignment_result(teacher_id, body)

    return result

@router.get("/list", response_model=list[TeacherOut])
async def list_teachers(
    session: AsyncSession = Depends(get_session),
):
    service = TeacherService(session)
    return await service.get_all_teachers()
