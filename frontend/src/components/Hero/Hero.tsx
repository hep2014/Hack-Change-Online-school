import { useEffect, useState } from "react";
import styles from "./Hero.module.css";

export default function Hero() {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Активируем анимацию после монтирования
    const timer = setTimeout(() => setAnimate(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className={styles.hero}>
      <div className="container">
        <div className={styles.inner}>
          <h1
            className={`${styles.title} ${animate ? styles.active : ""}`}
          >
            Онлайн-школа ITMO-технологии
          </h1>

          <p
            className={`${styles.subtitle} ${animate ? styles.active : ""}`}
          >
            Платформа, где технологии становятся навыками
          </p>

          <button
            className={`${styles.cta} ${animate ? styles.active : ""}`}
          >
            Начать обучение
          </button>
        </div>
      </div>
    </section>
  );
}
