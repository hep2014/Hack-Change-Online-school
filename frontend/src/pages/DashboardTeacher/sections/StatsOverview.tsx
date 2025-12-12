import styles from "./StatsOverview.module.css";
import type { TeacherStats } from "../../../types/teacherStats"; 
interface Props {
  stats: TeacherStats;
}
export default function StatsOverview({ stats }: Props) {
  if (!stats) return <div className={styles.loading}>Загрузка…</div>;

  return (
    <div className={styles.grid}>
      <div className={styles.card}>
        <div className={styles.icon}>🎓</div>
        <div className={styles.value}>{stats.courses}</div>
        <div className={styles.label}>Курсов</div>
      </div>

      <div className={styles.card}>
        <div className={styles.icon}>👥</div>
        <div className={styles.value}>{stats.students}</div>
        <div className={styles.label}>Студентов</div>
      </div>

      <div className={styles.card}>
        <div className={styles.icon}>📝</div>
        <div className={styles.value}>{stats.assignments}</div>
        <div className={styles.label}>Заданий</div>
      </div>

      <div className={styles.card}>
        <div className={styles.icon}>⭐</div>
        <div className={styles.value}>{stats.average_grade.toFixed(2)}</div>
        <div className={styles.label}>Средний балл</div>
      </div>
    </div>
  );
}
