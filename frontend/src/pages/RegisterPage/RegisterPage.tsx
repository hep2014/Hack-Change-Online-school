import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./RegisterPage.module.css";

export default function RegisterPage() {
  const nav = useNavigate();

  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    middlename: "",
    email: "",
    phone: "",
    age: "",
    gender: "",
    specialization: "",
    password: "",
    confirm: ""
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const update = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // строгая клиентская валидация по backend
  const validatePasswordClient = (password: string) => {
    if (password.length < 8) return "Пароль должен содержать минимум 8 символов";
    if (!/[a-z]/.test(password)) return "Нужна хотя бы одна строчная буква";
    if (!/[A-Z]/.test(password)) return "Нужна хотя бы одна заглавная буква";
    if (!/\d/.test(password)) return "Нужна хотя бы одна цифра";
    if (!/[!@#$%^&*()_\-=[\]{};':"\\|,.<>/?]/.test(password))
      return "Нужен хотя бы один спецсимвол";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // === валидация полей ===
    if (!form.lastname || !form.firstname)
      return setError("Имя и фамилия обязательны");

    if (!form.email) return setError("Введите email");

    if (!form.phone) return setError("Введите телефон");

    if (!form.age) return setError("Введите возраст");

    if (!form.gender) return setError("Укажите пол");

    if (!form.specialization)
      return setError("Введите специализацию преподавателя");

    const passwordError = validatePasswordClient(form.password);
    if (passwordError) return setError(passwordError);

    if (form.password !== form.confirm)
      return setError("Пароли не совпадают");

    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstname: form.firstname,
          lastname: form.lastname,
          middlename: form.middlename,
          email: form.email,
          phone: form.phone,
          age: Number(form.age),
          gender: form.gender,
          specialization: form.specialization,
          password: form.password,
          role: "teacher"
        })
      });

      let data: any = null;
      try {
            data = await res.json();
        } catch {
            // игнорируем json parse error
        }
      if (!res.ok) {
        if (data?.detail) {
        throw new Error(data.detail);
        }

        if (Array.isArray(data?.detail) && data.detail[0]?.msg) {
        throw new Error(data.detail[0].msg);
        }

        throw new Error("Ошибка регистрации");
    }
      // backend сразу логинит → сохраняем токены
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      localStorage.setItem("role", data.role);

      nav("/dashboard-teacher");

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.registerPage}>
      <div className={styles.container}>
        <div className={styles.formBlock}>
          <h1 className={styles.title}>Создать аккаунт преподавателя</h1>
          <p className={styles.subtitle}>Заполните форму для регистрации</p>

          {error && <div className={styles.error}>{error}</div>}

          <form className={styles.form} onSubmit={handleSubmit}>

            <div className={styles.row}>
              <label className={styles.label}>
                Фамилия
                <input
                  className={styles.input}
                  value={form.lastname}
                  onChange={(e) => update("lastname", e.target.value)}
                  required
                />
              </label>

              <label className={styles.label}>
                Имя
                <input
                  className={styles.input}
                  value={form.firstname}
                  onChange={(e) => update("firstname", e.target.value)}
                  required
                />
              </label>
            </div>

            <label className={styles.label}>
              Отчество
              <input
                className={styles.input}
                value={form.middlename}
                onChange={(e) => update("middlename", e.target.value)}
              />
            </label>

            <div className={styles.row}>
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
                Телефон
                <input
                  type="tel"
                  className={styles.input}
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  required
                />
              </label>
            </div>

            <div className={styles.row}>
              <label className={styles.label}>
                Возраст
                <input
                  type="number"
                  min={18}
                  max={100}
                  className={styles.input}
                  value={form.age}
                  onChange={(e) => update("age", e.target.value)}
                  required
                />
              </label>

              <label className={styles.label}>
                Пол
                <select
                  className={styles.input}
                  value={form.gender}
                  onChange={(e) => update("gender", e.target.value)}
                  required
                >
                  <option value="">Выберите…</option>
                  <option value="male">Мужской</option>
                  <option value="female">Женский</option>
                </select>
              </label>
            </div>

            <label className={styles.label}>
              Специализация
              <input
                className={styles.input}
                value={form.specialization}
                onChange={(e) => update("specialization", e.target.value)}
                required
              />
            </label>

            <div className={styles.row}>
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

              <label className={styles.label}>
                Подтверждение пароля
                <input
                  type="password"
                  className={styles.input}
                  value={form.confirm}
                  onChange={(e) => update("confirm", e.target.value)}
                  required
                />
              </label>
            </div>

            <label className={styles.checkbox}>
              <input type="checkbox" required />
              Я соглашаюсь с правилами и политикой конфиденциальности
            </label>

            <button type="submit" className={styles.btn} disabled={loading}>
              {loading ? "Регистрация..." : "Зарегистрироваться"}
            </button>

            <div className={styles.loginLink}>
              Уже есть аккаунт? <Link to="/login">Войти</Link>
            </div>
          </form>
        </div>

        <div className={styles.sidebar}>
          <h3>Почему стоит преподавать у нас?</h3>

          <div className={styles.features}>
            <div className={styles.feature}>📚 Собственная авторская программа</div>
            <div className={styles.feature}>✨ Высокая вовлечённость студентов</div>
            <div className={styles.feature}>🎓 Современная IT-платформа</div>
            <div className={styles.feature}>💼 Гибкий график</div>
            <div className={styles.feature}>🏆 Признание экспертов отрасли</div>
          </div>
        </div>
      </div>
    </main>
  );
}
