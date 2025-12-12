import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import StatsOverview from "./sections/StatsOverview";
import CreateAssignmentForm from "./sections/CreateAssignmentForm";
import Checking from "./sections/Checking";
import styles from "./DashboardTeacher.module.css";
import type { TeacherStats } from "../../types/teacherStats";
import type { Teacher } from "../../types/teacher"; // fio, age, specialization и т.д.


export default function DashboardTeacher() {
  const [active, setActive] = useState("overview");

  const [stats, setStats] = useState<TeacherStats | null>(null);
  const [teacher, setTeacher] = useState<Teacher | null>(null);

  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingTeacher, setLoadingTeacher] = useState(true);

  const token = localStorage.getItem("access_token");
  
  // Загружаем статистику преподавателя
  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("http://localhost:8000/teacher/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (res.ok) {
          setStats(data.stats);
        }
      } finally {
        setLoadingStats(false);
      }
    }

    fetchStats();
  }, [token]);

  // Загружаем информацию о преподавателе
  useEffect(() => {
    async function fetchTeacherInfo() {
      try {
        const res = await fetch("http://localhost:8000/teacher/info", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (res.ok) {
          setTeacher(data);
        }
      } finally {
        setLoadingTeacher(false);
      }
    }

    fetchTeacherInfo();
  }, [token]);

  return (
  <div className={styles.wrapper}>

    <div className={styles.content}>
      <Sidebar active={active} setActive={setActive} />

      <main className={styles.main}>
        <header className={styles.header}>
          <h1>
            Добро пожаловать,{" "}
            {loadingTeacher ? "..." : teacher?.fio || "Преподаватель"}!
          </h1>
        </header>

          {/* ====== КОНТЕНТ РАЗДЕЛОВ ====== */}

          {active === "overview" && (
            <>
              {loadingStats ? (
                <div className={styles.loading}>Загрузка статистики...</div>
              ) : (
                <StatsOverview stats={stats!} />
              )}
            </>
          )}

          {active === "courses" && (
            <div className={styles.loading}>Раздел “Мои курсы” скоро тут</div>
          )}

          {active === "groups" && (
            <div className={styles.loading}>Раздел “Группы” скоро тут</div>
          )}

          {active === "assignments" && (
            <CreateAssignmentForm />
          )}

          {active === "checking" && (
            <Checking />
          )}

          {active === "schedule" && (
            <div className={styles.loading}>Расписание в разработке</div>
          )}

          {active === "statistics" && (
            <div className={styles.loading}>Подробная статистика скоро тут</div>
          )}

          {active === "profile" && (
            <div className={styles.loading}>Редактирование профиля позже</div>
          )}

          {active === "support" && (
            <div className={styles.loading}>Поддержка появится позже</div>
          )}
        </main>
      </div>
    </div>
  );
}
