import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./LoginPage.module.css";

export default function LoginPage() {
  const nav = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Ошибка входа");
      }

      const data = await res.json();

      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      localStorage.setItem("role", data.role);

      if (data.role === "teacher") {
            nav("/dashboard-teacher");
        } else if (data.role === "student") {
            nav("/dashboard-student");
        } else {
            nav("/");
        }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.loginPage}>
      <div className={styles.container}>
        <div className={styles.formBlock}>
          <h1 className={styles.title}>Вход в личный кабинет</h1>
          <p className={styles.subtitle}>Введите свои данные, чтобы продолжить</p>

          {error && <div className={styles.error}>{error}</div>}

          <form className={styles.form} onSubmit={handleSubmit}>
            <label className={styles.label}>
              Email
              <input
                type="email"
                className={styles.input}
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                required
              />
            </label>

            <label className={styles.label}>
              Пароль
              <input
                type="password"
                className={styles.input}
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                required
              />
            </label>

            <div className={styles.options}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={form.remember}
                  onChange={(e) => update("remember", e.target.checked)}
                />
                Запомнить меня
              </label>

              <Link to="/forgot-password" className={styles.forgot}>
                Забыли пароль?
              </Link>
            </div>

            <button
              type="submit"
              className={styles.loginBtn}
              disabled={loading}
            >
              {loading ? "Вход..." : "Войти"}
            </button>

            <div className={styles.register}>
              Еще нет аккаунта?{" "}
              <Link to="/register">Зарегистрироваться</Link>
            </div>
          </form>
        </div>

        <div className={styles.sidebar}>
            <h3 className={styles.sidebarTitle}>Преимущества обучения</h3>

            <div className={styles.features}>
                    {[
                        "📚 Доступ ко всем курсам",
                        "👨‍🏫 Поддержка преподавателей",
                        "📊 Отслеживание прогресса",
                        "🎓 Сертификаты",
                        "💼 Помощь с трудоустройством"
                    ].map((text, i) => (
                        <div
                        key={i}
                        className={styles.feature}
                        style={{ animationDelay: `${0.15 * i}s` }}
                        >
                        {text}
                        </div>
                    ))}
                    </div>
            </div>
      </div>
    </main>
  );
}
