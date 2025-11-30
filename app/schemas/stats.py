from pydantic import BaseModel

class TeacherStatsOut(BaseModel):
    activeCourses: int
    students: int
    worksToCheck: int
    avgPerformance: float | None
