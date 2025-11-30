import React, { useState, JSX } from "react";
import { Link } from "react-router-dom";
export default function Login(): JSX.Element {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Ошибка авторизации");
      }

      const data = await res.json();

      // Токен сохраняем
      if (remember) {
        localStorage.setItem("token", data.token);
      } else {
        sessionStorage.setItem("token", data.token);
      }

      // Перенаправляем
      window.location.href = "/dashboard-teacher";

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="wrapper login-wrapper">
      {/* Header (можно вынести в отдельный компонент Header и импортировать) */}
      <header className="header">
        <div className="container">
          <div className="header__inner">
            <a className="header__logo" href="/">
              <img src="/images/logo.svg" alt="Логотип" />
            </a>

            <nav className="header__nav">
              <ul className="header__nav-list">
                <li><a href="/#courses">Курсы</a></li>
                <li><a href="/#about">О школе</a></li>
                <li><a href="/#teachers">Преподаватели</a></li>
                <li><a href="/login" className="header__nav-link">Мои курсы</a></li>
              </ul>
            </nav>

            <div className="header__auth">
              <a href="/login" className="header__login">Войти</a>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="login-main">
        <div className="container">
          <div className="login-container">
            <div className="login-form-wrapper">
              <h1 className="login-title">Вход в личный кабинет</h1>
              <p className="login-subtitle">Введите ваши данные для входа в систему</p>

              <form className="login-form" onSubmit={handleSubmit} noValidate>
                {error && <div className="form-error" style={{ color: "crimson", marginBottom: 12 }}>{error}</div>}

                <div className="form-group">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="form-input"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password" className="form-label">Пароль</label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    className="form-input"
                    placeholder="Введите пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="form-options" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                  <label className="checkbox-label" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                    <input
                      type="checkbox"
                      name="remember"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                    />
                    <span className="checkmark" />
                    Запомнить меня
                  </label>

                  <a href="/forgot-password" className="forgot-password">Забыли пароль?</a>
                </div>

                <button type="submit" className="login-btn button" style={{ marginTop: 18 }}>Войти</button>

                <div className="register-link" style={{ marginTop: 12 }}>
                  Еще нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
                </div>
              </form>
            </div>

            {/* Sidebar */}
            <aside className="login-sidebar">
              <h3>Преимущества обучения</h3>
              <ul className="features-list">
                <li>📚 Доступ ко всем курсам</li>
                <li>👨‍🏫 Обратная связь от преподавателей</li>
                <li>📊 Отслеживание прогресса</li>
                <li>🎓 Сертификаты о завершении</li>
                <li>💼 Помощь с трудоустройством</li>
              </ul>
            </aside>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>© 2024 Онлайн-школа Ilyukhi Nevduplenysha. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
}

