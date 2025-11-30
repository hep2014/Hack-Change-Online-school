import { useState } from "react";
import { Link } from "react-router-dom"; 
import "../css/reset.css";
import "../css/style.css";

export default function RegisterPage() {
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    middlename: "",
    email: "",
    phone: "",
    age: "",
    gender: "",
    password: "",
    confirm: "",
    role: "student",
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);

  if (form.password !== form.confirm) {
    setError("Пароли не совпадают.");
    return;
  }

  setLoading(true);

  try {
    const res = await fetch("http://localhost:8000/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstname: form.firstname,
        lastname: form.lastname,
        middlename: form.middlename || null, // лучше явно
        email: form.email,
        phone: form.phone,
        age: Number(form.age),
        gender: form.gender === "Мужской" ? "M" : "F", // или оставь как есть
        password: form.password,
        role: "teacher",
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(JSON.stringify(data));
    }

    const data = await res.json();

    window.location.href = "/dashboard-teacher"; // перенаправление куда надо
  } catch (err: any) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="wrapper register-wrapper">

      {/* HEADER */}
      <header className="header">
        <div className="container">
          <div className="header__inner">

            <Link className="header__logo" to="/">
              <img src="/images/logo.svg" alt="Логотип" />
            </Link>

            <nav className="header__nav">
              <ul className="header__nav-list">
                <li><a href="/#courses">Курсы</a></li>
                <li><a href="/#about">О школе</a></li>
                <li><a href="/#teachers">Преподаватели</a></li>
                <li>
                  <Link to="/login" className="header__nav-link">Мои курсы</Link>
                </li>
              </ul>
            </nav>

            <div className="header__auth">
              <Link to="/login" className="header__login">Войти</Link>
            </div>

          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="register-main">
        <div className="container">
          <div className="register-container">

            {/* ФОРМА */}
            <div className="register-form-wrapper">
              <h1 className="register-title">Создать аккаунт</h1>
              <p className="register-subtitle">Заполните данные для регистрации</p>

              {error && (
                <div style={{ color: "crimson", marginBottom: 12 }}>
                  {error}
                </div>
              )}

              <form className="register-form" onSubmit={handleSubmit}>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Фамилия</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Иванов"
                      required
                      value={form.lastname}
                      onChange={(e) => update("lastname", e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Имя</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Иван"
                      required
                      value={form.firstname}
                      onChange={(e) => update("firstname", e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Отчество</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Иванович"
                    value={form.middlename}
                    onChange={(e) => update("middlename", e.target.value)}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-input"
                      placeholder="your@email.com"
                      required
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Телефон</label>
                    <input
                      type="tel"
                      className="form-input"
                      placeholder="+7 (999) 999-99-99"
                      required
                      value={form.phone}
                      onChange={(e) => update("phone", e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Возраст</label>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="18"
                      min={16}
                      max={100}
                      required
                      value={form.age}
                      onChange={(e) => update("age", e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Пол</label>
                    <div className="radio-group">

                      <label className="radio-label">
                        <input
                          type="radio"
                          name="gender"
                          value="male"
                          required
                          checked={form.gender === "male"}
                          onChange={(e) => update("gender", e.target.value)}
                        />
                        <span className="radio-custom"></span>
                        Мужской
                      </label>

                      <label className="radio-label">
                        <input
                          type="radio"
                          name="gender"
                          value="female"
                          checked={form.gender === "female"}
                          onChange={(e) => update("gender", e.target.value)}
                        />
                        <span className="radio-custom"></span>
                        Женский
                      </label>

                    </div>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Пароль</label>
                    <input
                      type="password"
                      className="form-input"
                      placeholder="Минимум 6 символов"
                      required
                      value={form.password}
                      onChange={(e) => update("password", e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Подтвердите пароль</label>
                    <input
                      type="password"
                      className="form-input"
                      placeholder="Повторите пароль"
                      required
                      value={form.confirm}
                      onChange={(e) => update("confirm", e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-agreements">
                  <label className="checkbox-label">
                    <input type="checkbox" required />
                    <span className="checkmark"></span>
                    Я соглашаюсь с{" "}
                    <a className="link" href="#">правилами использования</a> и{" "}
                    <a className="link" href="#">политикой конфиденциальности</a>
                  </label>

                  <label className="checkbox-label">
                    <input type="checkbox" />
                    <span className="checkmark"></span>
                    Хочу получать новости и специальные предложения
                  </label>
                </div>

                <button type="submit" className="register-btn button" disabled={loading}>
                  {loading ? "Загрузка..." : "Зарегистрироваться"}
                </button>

                <div className="login-link">
                  Уже есть аккаунт? <Link to="/login">Войти</Link>
                </div>

              </form>
            </div>

            {/* SIDEBAR */}
            <div className="register-sidebar">
              <h3>Почему стоит учиться у нас?</h3>
              <ul className="features-list">
                <li>🎯 Персональный подход к каждому студенту</li>
                <li>📈 Гарантированное трудоустройство</li>
                <li>👨‍🏫 Преподаватели-практики</li>
                <li>💻 Современные методики обучения</li>
                <li>🏆 Сертификаты государственного образца</li>
                <li>🤝 Сообщество выпускников</li>
                <li>📚 Доступ к материалам навсегда</li>
              </ul>
            </div>

          </div>
        </div>
      </main>

      <footer className="footer">
        <div className="container">
          <p>© 2024 Онлайн-школа Ilyukhi Nevduplenysha. Все права защищены.</p>
        </div>
      </footer>

    </div>
  );
}
