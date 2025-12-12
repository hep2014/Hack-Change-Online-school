from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, cast, Integer
from datetime import date
from app.models.courses import Course
from app.models.groups import Group
from app.models.student_groups import StudentGroup
from fastapi import HTTPException
from app.models.results import AssignmentResult
from app.models.assignments import Assignment
from app.schemas.assignments import AssignmentCreate
from app.models.assignment_files import AssignmentFile
from pathlib import Path
from app.schemas.results import ResultCreate
from app.models.teachers import Teacher

class TeacherService:
    def __init__(self, session: AsyncSession):
        self.session = session

    # ----------------------------------------------
    #   СТАТИСТИКА ПРЕПОДАВАТЕЛЯ
    # ----------------------------------------------
    async def get_teacher_stats(self, teacher_id: int) -> dict:

        # ----- 1. Количество курсов -----
        q_courses = await self.session.execute(
            select(func.count()).select_from(Course).where(Course.teacherid == teacher_id)
        )
        courses_count = q_courses.scalar()

        # ----- 2. Количество учеников -----
        q_students = await self.session.execute(
            select(func.count(func.distinct(StudentGroup.studentid)))
            .join(Group, Group.groupid == StudentGroup.groupid)
            .join(Course, Course.courseid == Group.courseid)
            .where(Course.teacherid == teacher_id)
        )
        students_count = q_students.scalar()

        # ----- 3. Количество домашних заданий -----
        q_assignments = await self.session.execute(
            select(func.count()).select_from(Assignment)
            .join(Course, Course.courseid == Assignment.courseid)
            .where(Course.teacherid == teacher_id)
        )
        assignments_count = q_assignments.scalar()

        # ----- 4. Средняя оценка -----
        q_avg = await self.session.execute(
            select(func.avg(AssignmentResult.grade))
            .select_from(AssignmentResult)
            .join(Assignment, Assignment.assignmentid == AssignmentResult.assignmentid)
            .join(Course, Course.courseid == Assignment.courseid)
            .where(Course.teacherid == teacher_id)
        )
        avg_grade = q_avg.scalar() or 0

        # Возвращаем всё одной структурой
        return {
            "courses": courses_count,
            "students": students_count,
            "assignments": assignments_count,
            "average_grade": float(avg_grade),
        }

    async def create_assignment(self, teacher_id: int, data: AssignmentCreate) -> Assignment:
        # Проверяем, что этот препод ведёт курс
        q = await self.session.execute(
            select(Course).where(
                Course.courseid == data.courseid,
                Course.teacherid == teacher_id,
            )
        )
        course = q.scalars().first()
        if not course:
            raise HTTPException(403, "Вы не можете создавать задания для чужого курса")

        # Проверяем дедлайн
        if data.deadline and data.deadline < date.today():
            raise HTTPException(400, "Дедлайн не может быть в прошлом")

        # Создаём объект задания
        assignment = Assignment(
            title=data.title,
            type=data.type,
            deadline=data.deadline,
            description=data.description,
            courseid=data.courseid,
        )

        self.session.add(assignment)
        await self.session.commit()
        await self.session.refresh(assignment)

        return assignment

    async def get_assignment_file(self, teacher_id: int, assignment_id: int):
        # 1. Проверяем принадлежность задания преподавателю
        q_assign = await self.session.execute(
            select(Assignment)
            .join(Course, Course.courseid == Assignment.courseid)
            .where(
                Assignment.assignmentid == assignment_id,
                Course.teacherid == teacher_id
            )
        )
        assignment = q_assign.scalars().first()

        if assignment is None:
            raise HTTPException(403, "Вы не можете скачивать файлы чужих заданий")

        # 2. Ищем файл
        q_file = await self.session.execute(
            select(AssignmentFile)
            .where(AssignmentFile.assignment_id == cast(assignment_id, Integer))
        )
        file_obj = q_file.scalars().first()

        if file_obj is None:
            raise HTTPException(404, "Файл для этого задания не найден")

        # 3. Проверяем, что файл существует
        path = Path(file_obj.file_path)
        if not path.exists():
            raise HTTPException(404, "Файл отсутствует на сервере")

        return file_obj

    async def set_assignment_result(self, teacher_id: int, data: ResultCreate) -> AssignmentResult:
        """
        Преподаватель выставляет или обновляет оценку студенту.
        """

        # ----- 1. Проверяем, что задание принадлежит преподавателю
        q_assign = await self.session.execute(
            select(Assignment)
            .join(Course, Course.courseid == Assignment.courseid)
            .where(
                Assignment.assignmentid == data.assignmentid,
                Course.teacherid == teacher_id
            )
        )
        assignment = q_assign.scalars().first()
        if not assignment:
            raise HTTPException(403, "Вы не можете оценивать задания чужих курсов")

        # ----- 2. Проверяем, что студент учится у преподавателя
        q_stud = await self.session.execute(
            select(StudentGroup)
            .join(Group, Group.groupid == StudentGroup.groupid)
            .join(Course, Course.courseid == Group.courseid)
            .where(
                StudentGroup.studentid == data.studentid,
                Course.teacherid == teacher_id
            )
        )
        student_rel = q_stud.scalars().first()
        if not student_rel:
            raise HTTPException(403, "Этот студент не относится к вашим группам")

        # ----- 3. Ищем существующую запись
        q_result = await self.session.execute(
            select(AssignmentResult)
            .where(
                AssignmentResult.assignmentid == data.assignmentid,
                AssignmentResult.studentid == data.studentid
            )
        )
        existing = q_result.scalars().first()

        # ----- 4. Если результат есть — обновляем
        if existing:
            existing.grade = data.grade
            existing.comment = data.comment
            existing.submissiondate = data.submissiondate or date.today()

            await self.session.commit()
            await self.session.refresh(existing)
            return existing

        # ----- 5. Создаём новый результат
        new_result = AssignmentResult(
            grade=data.grade,
            comment=data.comment,
            submissiondate=data.submissiondate or date.today(),
            assignmentid=data.assignmentid,
            studentid=data.studentid
        )
        self.session.add(new_result)
        await self.session.commit()
        await self.session.refresh(new_result)

        return new_result

    async def get_all_teachers(self):
        q = await self.session.execute(select(Teacher))
        return q.scalars().all()
