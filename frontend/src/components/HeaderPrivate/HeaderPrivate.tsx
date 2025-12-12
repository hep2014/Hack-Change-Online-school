import { Link, useNavigate } from "react-router-dom";
import styles from "./HeaderPrivate.module.css";

async function logout(navigate: ReturnType<typeof useNavigate>) {
  const refresh = localStorage.getItem("refresh_token");

  try {
    if (refresh) {
      await fetch("http://localhost:8000/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: refresh }),
      });
    }
  } catch (_) {
    // даже если ошибка — всё равно выходим
  }

  // Полная очистка
  localStorage.clear();

  // Редирект на страницу логина
  navigate("/login");
}

export default function HeaderPrivate() {
  const navigate = useNavigate();

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <Link to="/dashboard-teacher" className={styles.logo}>
          ITMO-технологии
        </Link>
      </div>

      <div className={styles.right}>
        <button
          className={styles.logout}
          onClick={() => logout(navigate)}
        >
          Выйти
        </button>
      </div>
    </header>
  );
}
