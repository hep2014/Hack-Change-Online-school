import { useEffect, useState } from "react";
import styles from "./Teachers.module.css";
import type { Teacher } from "../../types/teacher";

interface Props {
  teacher: Teacher;
  index: number; // для задержки анимации
}

export default function TeacherCard({ teacher, index }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 150 * index);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <div className={`${styles.card} ${visible ? styles.cardVisible : ""}`}>
      <h3 className={styles.fio}>{teacher.fio}</h3>

      {teacher.age && (
        <p className={styles.text}>Возраст: {teacher.age}</p>
      )}

      <p className={styles.text}>Специализация: {teacher.specialization}</p>

      {teacher.experience && (
        <p className={styles.text}>Опыт: {teacher.experience} лет</p>
      )}
    </div>
  );
}
