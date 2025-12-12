import { useState } from "react";
import styles from "./Checking.module.css";

export default function Checking() {
  const [assignmentId, setAssignmentId] = useState("");
  const [studentId, setStudentId] = useState("");
  const [grade, setGrade] = useState("");
  const [comment, setComment] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = localStorage.getItem("access");

  function downloadFile() {
    window.open(
      `http://localhost:8000/teacher/assignments/${assignmentId}/file`,
      "_blank"
    );
  }

  async function submitResult(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await fetch("http://localhost:8000/teacher/assignments/result", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          assignmentid: Number(assignmentId),
          studentid: Number(studentId),
          grade: Number(grade),
          comment,
          submissiondate: null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail);

      setSuccess("Оценка успешно выставлена!");
    } catch (e: any) {
      setError(e.message);
    }
  }

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Проверка работ</h2>

      {error && <div className={styles.error}>{error}</div>}
      {success && <div className={styles.success}>{success}</div>}

      <div className={styles.block}>
        <h3>Загрузить работу студента</h3>

        <input
          className={styles.input}
          placeholder="ID задания"
          value={assignmentId}
          onChange={(e) => setAssignmentId(e.target.value)}
        />

        <button className={styles.btn} onClick={downloadFile}>
          Скачать файл
        </button>
      </div>

      <form onSubmit={submitResult} className={styles.block}>
        <h3>Выставить оценку</h3>

        <input
          className={styles.input}
          placeholder="ID задания"
          value={assignmentId}
          onChange={(e) => setAssignmentId(e.target.value)}
          required
        />

        <input
          className={styles.input}
          placeholder="ID студента"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          required
        />

        <input
          className={styles.input}
          placeholder="Оценка"
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
          required
        />

        <textarea
          className={styles.textarea}
          placeholder="Комментарий"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <button className={styles.btn} type="submit">
          Отправить
        </button>
      </form>
    </div>
  );
}
