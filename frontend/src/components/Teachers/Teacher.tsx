import { useEffect, useState } from "react";
import styles from "./Teachers.module.css";
import TeacherCard from "./TeacherCard";
import type { Teacher } from "../../types/teacher";

export default function Teachers() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  async function loadTeachers() {
    try {
      const res = await fetch("http://localhost:8000/teacher/list");

      if (!res.ok) throw new Error("Ошибка загрузки преподавателей");

      const data = await res.json();

      setTeachers(data); // теперь это массив
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  loadTeachers();
}, []);

  return (
    <section className={styles.teachers}>
      <div className="container">
        <h2 className={styles.title}>Наши преподаватели</h2>

        {loading && <p className={styles.loading}>Загрузка...</p>}

        <div className={styles.grid}>
          {teachers.map((t, i) => (
            <TeacherCard key={t.teacherid} teacher={t} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
