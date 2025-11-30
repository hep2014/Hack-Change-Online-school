import "../css/reset.css";
import "../css/style.css";

export default function ForgotPasswordPage() {
  return (
    <div className="wrapper forgot-password-wrapper">

      {/* HEADER */}
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

      {/* MAIN */}
      <main className="forgot-password-main">
        <div className="container">
          <div className="forgot-password-container">

            {/* FORM BLOCK */}
            <div className="forgot-password-form-wrapper">

              <h1 className="forgot-password-title">Восстановление пароля</h1>
              <p className="forgot-password-subtitle">
                Введите email, который вы использовали при регистрации, и мы вышлем вам ссылку для сброса пароля
              </p>

              <form className="forgot-password-form">

                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <button type="submit" className="forgot-password-btn button">
                  Отправить ссылку для восстановления
                </button>

                <div className="forgot-password-links">
                  <a href="/login" className="back-to-login">← Вернуться к входу</a>
                </div>

              </form>

            </div>

            {/* SIDEBAR */}
            <div className="forgot-password-sidebar">
              <h3>Не можете войти в аккаунт?</h3>
              <ul className="features-list">
                <li>📧 Проверьте правильность введенного email</li>
                <li>🕐 Ссылка для восстановления будет активна 1 час</li>
                <li>🔐 После сброса рекомендуем установить надежный пароль</li>
                <li>👨‍🏫 Если проблема повторяется, свяжитесь с технической поддержкой</li>
              </ul>

              <div className="support-info">
                <h4>Техническая поддержка</h4>
                <p>Email: support@ilyukhi-school.ru</p>
                <p>Телефон: +7 (999) 123-45-67</p>
                <p>Время работы: 9:00 – 18:00 (МСК)</p>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container">
          <p>© 2024 Онлайн-школа Ilyukhi Nevduplenysha. Все права защищены.</p>
        </div>
      </footer>

    </div>
  );
}
