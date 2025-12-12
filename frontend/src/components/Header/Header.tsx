import { Link } from "react-router-dom";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className="container">
        <div className={styles.inner}>

          {/* ЛОГОТИП */}
          <Link to="/" className={styles.logo}>
            ITMO-технологии
          </Link>

          {/* НАВИГАЦИЯ */}
          <nav className={styles.nav}>
            <Link to="/login" className={styles.navLink}>Войти</Link>
            <Link to="/register" className={styles.navButton}>Регистрация</Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
