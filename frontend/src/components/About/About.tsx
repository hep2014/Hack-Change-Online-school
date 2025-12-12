import styles from "./About.module.css";
import { useInView } from "../../hooks/useInView";
import AnimatedNumber from "./AnimatedNumber";

export default function About() {
  const { ref, isInView } = useInView({
    threshold: 0.3,
    rootMargin: "0px 0px -50px 0px",
  });

  return (
    <section className={styles.about} id="about" ref={ref}>
      <div className="container">
        <h2 className={styles.title}>О нашей школе</h2>

        <div className={styles.counters}>
          <div className={styles.counterItem}>
            <span className={styles.counterNumber}>
              {isInView ? <AnimatedNumber value={1200} /> : 0}+
            </span>
            <span className={styles.counterLabel}>Студентов</span>
          </div>

          <div className={styles.counterItem}>
            <span className={styles.counterNumber}>
              {isInView ? <AnimatedNumber value={84} /> : 0}
            </span>
            <span className={styles.counterLabel}>Курса</span>
          </div>

          <div className={styles.counterItem}>
            <span className={styles.counterNumber}>
              {isInView ? <AnimatedNumber value={50} /> : 0}
            </span>
            <span className={styles.counterLabel}>Преподавателей</span>
          </div>
        </div>

        <div className={styles.textBlock}>
          <p>
            Онлайн-школа ITMO-технологии — современная образовательная
            платформа, созданная для тех, кто хочет развиваться в IT независимо
            от уровня подготовки.
          </p>

          <p>
            Мы верим в технологичное обучение: практику, актуальные навыки,
            поддержку преподавателей и честный путь в профессию.
          </p>

          <p>
            Наша цель — помочь каждому студенту уверенно выйти на рынок труда,
            получить сильный фундамент и начать карьеру в ведущих компаниях.
          </p>
        </div>
      </div>
    </section>
  );
}
