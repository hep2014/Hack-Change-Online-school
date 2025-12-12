import { useEffect, useState } from "react";
import styles from "./CreateAssignmentForm.module.css";

interface Course {
  courseid: number;
  title: string;
}

export default function CreateAssignmentForm() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  const [title, setTitle] = useState("");
  const [type, setType] = useState("practice");
  const [deadline, setDeadline] = useState("");
  const [description, setDescription] = useState("");
  const [courseId, setCourseId] = useState<number | null>(null);

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("access");

  // Загружаем курсы преподавателя
  useEffect(() => {
    async function loadCourses() {
      try {
        const res = await fetch("http://localhost:8000/courses/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || "Ошибка загрузки курсов");

        setCourses(data);
        if (data.length > 0) setCourseId(data[0].courseid);

      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoadingCourses(false);
      }
    }

    loadCourses();
  }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!courseId) {
      setError("Выберите курс");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/teacher/assignments/create", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          type,
          deadline: deadline || null,
          description,
          courseid: courseId,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Ошибка создания задания");

      setSuccess("Задание успешно создано!");
      setTitle("");
      setType("practice");
      setDeadline("");
      setDescription("");

    } catch (e: any) {
      setError(e.message);
    }
  }

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Создать задание</h2>

      {error && <div className={styles.error}>{error}</div>}
      {success && <div className={styles.success}>{success}</div>}

      {loadingCourses ? (
        <div className={styles.loading}>Загрузка курсов...</div>
      ) : (
        <form className={styles.form} onSubmit={handleSubmit}>

          <label className={styles.label}>
            Курс
            <select
              className={styles.input}
              value={courseId ?? ""}
              onChange={(e) => setCourseId(Number(e.target.value))}
            >
              {courses.map((c) => (
                <option key={c.courseid} value={c.courseid}>
                  {c.title}
                </option>
              ))}
            </select>
          </label>

          <label className={styles.label}>
            Название задания
            <input
              className={styles.input}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </label>

          <label className={styles.label}>
            Тип
            <select
              className={styles.input}
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="practice">Практика</option>
              <option value="test">Тест</option>
              <option value="project">Проект</option>
            </select>
          </label>

          <label className={styles.label}>
            Дедлайн
            <input
              type="date"
              className={styles.input}
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </label>

          <label className={styles.label}>
            Описание
            <textarea
              className={styles.textarea}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>

          <button className={styles.btn} type="submit">
            Создать задание
          </button>
        </form>
      )}
    </div>
  );
}
