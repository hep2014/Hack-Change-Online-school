import styles from "./Sidebar.module.css";

interface Props {
  active: string;
  setActive: (value: string) => void;
}

export default function Sidebar({ active, setActive }: Props) {
  return (
    <aside className={styles.sidebar}>
      <h2 className={styles.title}>Кабинет преподавателя</h2>

      <nav className={styles.nav}>
        <button
          className={active === "dashboard" ? styles.active : ""}
          onClick={() => setActive("dashboard")}
        >
          📊 Дашборд
        </button>

        <button
          className={active === "courses" ? styles.active : ""}
          onClick={() => setActive("courses")}
        >
          🎓 Мои курсы
        </button>

        <button
          className={active === "assignments" ? styles.active : ""}
          onClick={() => setActive("assignments")}
        >
          📝 Задания
        </button>

        <button
          className={active === "checking" ? styles.active : ""}
          onClick={() => setActive("checking")}
        >
          ✅ Проверка работ
        </button>

        <button
          className={active === "statistics" ? styles.active : ""}
          onClick={() => setActive("statistics")}
        >
          📈 Статистика
        </button>

        <button
          className={active === "profile" ? styles.active : ""}
          onClick={() => setActive("profile")}
        >
          👤 Профиль
        </button>
      </nav>
    </aside>
  );
}
