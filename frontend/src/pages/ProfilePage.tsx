import { useState } from "react";
import "../css/reset.css";
import "../css/style.css";

export default function ProfilePage() {
  const [activeSection, setActiveSection] = useState("personal");

  const sections = ["personal", "security", "appearance", "notifications", "privacy"];

  return (
    <div className="wrapper profile-wrapper">
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
                <li><a href="/dashboard" className="header__nav-link">Переходник в ЛК</a></li>
              </ul>
            </nav>
            <div className="header__auth">
              <a href="/dashboard" className="header__login">В ЛК</a>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="profile-main">
        <div className="container">
          <div className="profile-container">

            {/* SIDEBAR */}
            <aside className="profile-sidebar">
              <div className="profile-user">
                <div className="profile-avatar">
                  <img src="/images/icons/avatar.jpg" alt="Аватар" />
                  <button className="avatar-edit-btn">✏️</button>
                </div>
                <h2 className="profile-name">Иван Иванов</h2>
                <p className="profile-email">ivan@example.com</p>
              </div>

              <nav className="profile-nav">
                <ul className="profile-nav-list">
                  <li>
                    <button
                      className={`profile-nav-link ${activeSection === "personal" ? "active" : ""}`}
                      onClick={() => setActiveSection("personal")}
                    >
                      👤 Личные данные
                    </button>
                  </li>

                  <li>
                    <button
                      className={`profile-nav-link ${activeSection === "security" ? "active" : ""}`}
                      onClick={() => setActiveSection("security")}
                    >
                      🔐 Безопасность
                    </button>
                  </li>

                  <li>
                    <button
                      className={`profile-nav-link ${activeSection === "appearance" ? "active" : ""}`}
                      onClick={() => setActiveSection("appearance")}
                    >
                      🎨 Внешний вид
                    </button>
                  </li>

                  <li>
                    <button
                      className={`profile-nav-link ${activeSection === "notifications" ? "active" : ""}`}
                      onClick={() => setActiveSection("notifications")}
                    >
                      🔔 Уведомления
                    </button>
                  </li>

                  <li>
                    <button
                      className={`profile-nav-link ${activeSection === "privacy" ? "active" : ""}`}
                      onClick={() => setActiveSection("privacy")}
                    >
                      🛡️ Конфиденциальность
                    </button>
                  </li>

                </ul>
              </nav>
            </aside>

            {/* CONTENT */}
            <div className="profile-content">

              {/* PERSONAL */}
              {activeSection === "personal" && (
                <section className="profile-section active">
                  <h2 className="profile-section-title">Личные данные</h2>
                  <form className="profile-form">

                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Имя</label>
                        <input type="text" className="form-input" defaultValue="Иван" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Фамилия</label>
                        <input type="text" className="form-input" defaultValue="Иванов" />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Отчество</label>
                      <input type="text" className="form-input" defaultValue="Иванович" />
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Email</label>
                        <input type="email" className="form-input" defaultValue="ivan@example.com" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Телефон</label>
                        <input type="tel" className="form-input" defaultValue="+7 (999) 123-45-67" />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Дата рождения</label>
                        <input type="date" className="form-input" defaultValue="1995-05-15" />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Пол</label>
                        <div className="radio-group">
                          <label className="radio-label">
                            <input type="radio" name="gender" defaultChecked />
                            <span className="radio-custom"></span>
                            Мужской
                          </label>
                          <label className="radio-label">
                            <input type="radio" name="gender" />
                            <span className="radio-custom"></span>
                            Женский
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">О себе</label>
                      <textarea
                        className="form-textarea"
                        rows={4}
                        defaultValue="Студент IT-направления, увлекаюсь веб-разработкой и кибербезопасностью."
                      />
                    </div>

                    <button type="submit" className="profile-save-btn button">Сохранить изменения</button>
                  </form>
                </section>
              )}

              {/* SECURITY */}
              {activeSection === "security" && (
                <section className="profile-section active">
                  <h2 className="profile-section-title">Безопасность</h2>

                  <div className="security-settings">
                    <div className="security-item">
                      <h3>Смена пароля</h3>
                      <form className="password-form">
                        <div className="form-group">
                          <label className="form-label">Текущий пароль</label>
                          <input type="password" className="form-input" />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Новый пароль</label>
                          <input type="password" className="form-input" />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Подтвердите пароль</label>
                          <input type="password" className="form-input" />
                        </div>
                        <button className="password-save-btn button">Обновить пароль</button>
                      </form>
                    </div>

                    <div className="security-item">
                      <h3>Двухфакторная аутентификация</h3>
                      <label className="toggle-label">
                        <input type="checkbox" className="toggle-input" />
                        <span className="toggle-slider"></span>
                        <span className="toggle-text">Включить 2FA</span>
                      </label>
                    </div>

                    <div className="security-item">
                      <h3>Активные сессии</h3>
                      <div className="sessions-list">
                        <div className="session-item current">
                          <div className="session-info">
                            <strong>Текущее устройство</strong>
                            <p>Chrome на Windows • Санкт-Петербург</p>
                            <span className="session-time">Сейчас активна</span>
                          </div>
                          <button className="session-logout-btn">Завершить</button>
                        </div>

                        <div className="session-item">
                          <div className="session-info">
                            <strong>iPhone 13</strong>
                            <p>Safari на iOS • Москва</p>
                            <span className="session-time">2 часа назад</span>
                          </div>
                          <button className="session-logout-btn">Завершить</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* APPEARANCE */}
              {activeSection === "appearance" && (
                <section className="profile-section active">
                  <h2 className="profile-section-title">Внешний вид</h2>

                  {/* Всё оставлено как в HTML */}
                  <div className="appearance-settings">
                    {/* темы */}
                    <div className="appearance-item">
                      <h3>Тема оформления</h3>
                      <div className="theme-selector">

                        <label className="theme-option">
                          <input type="radio" name="theme" defaultChecked />
                          <div className="theme-preview theme-light">
                            <div className="theme-demo">
                              <div className="demo-header"></div>
                              <div className="demo-content"></div>
                            </div>
                          </div>
                          <span className="theme-name">Светлая</span>
                        </label>

                        <label className="theme-option">
                          <input type="radio" name="theme" />
                          <div className="theme-preview theme-dark">
                            <div className="theme-demo">
                              <div className="demo-header"></div>
                              <div className="demo-content"></div>
                            </div>
                          </div>
                          <span className="theme-name">Тёмная</span>
                        </label>

                        <label className="theme-option">
                          <input type="radio" name="theme" />
                          <div className="theme-preview theme-auto">
                            <div className="theme-demo">
                              <div className="demo-header"></div>
                              <div className="demo-content"></div>
                            </div>
                          </div>
                          <span className="theme-name">Системная</span>
                        </label>

                      </div>
                    </div>

                    {/* шрифты */}
                    <div className="appearance-item">
                      <h3>Размер шрифта</h3>
                      <div className="font-size-selector">

                        <label className="font-size-option">
                          <input type="radio" name="font-size" />
                          <span className="font-size-preview small">Аа</span>
                          <span className="font-size-name">Маленький</span>
                        </label>

                        <label className="font-size-option">
                          <input type="radio" name="font-size" defaultChecked />
                          <span className="font-size-preview medium">Аа</span>
                          <span className="font-size-name">Средний</span>
                        </label>

                        <label className="font-size-option">
                          <input type="radio" name="font-size" />
                          <span className="font-size-preview large">Аа</span>
                          <span className="font-size-name">Большой</span>
                        </label>

                      </div>
                    </div>

                    {/* цвет */}
                    <div className="appearance-item">
                      <h3>Цвет акцента</h3>
                      <div className="accent-color-selector">

                        <label className="accent-color-option">
                          <input type="radio" name="accent" defaultChecked />
                          <span className="color-swatch red"></span>
                          <span className="color-name">Красный</span>
                        </label>

                        <label className="accent-color-option">
                          <input type="radio" name="accent" />
                          <span className="color-swatch blue"></span>
                          <span className="color-name">Синий</span>
                        </label>

                        <label className="accent-color-option">
                          <input type="radio" name="accent" />
                          <span className="color-swatch green"></span>
                          <span className="color-name">Зелёный</span>
                        </label>

                        <label className="accent-color-option">
                          <input type="radio" name="accent" />
                          <span className="color-swatch purple"></span>
                          <span className="color-name">Фиолетовый</span>
                        </label>

                      </div>
                    </div>

                  </div>
                </section>
              )}

              {/* NOTIFICATIONS */}
              {activeSection === "notifications" && (
                <section className="profile-section active">
                  <h2 className="profile-section-title">Уведомления</h2>

                  <div className="notification-settings">
                    <div className="notification-category">
                      <h3>Email уведомления</h3>
                      <div className="notification-options">

                        <label className="toggle-label">
                          <input type="checkbox" defaultChecked />
                          <span className="toggle-slider"></span>
                          <span className="toggle-text">Новые задания</span>
                        </label>

                        <label className="toggle-label">
                          <input type="checkbox" defaultChecked />
                          <span className="toggle-slider"></span>
                          <span className="toggle-text">Оценки и отзывы</span>
                        </label>

                        <label className="toggle-label">
                          <input type="checkbox" />
                          <span className="toggle-slider"></span>
                          <span className="toggle-text">Расписание занятий</span>
                        </label>

                        <label className="toggle-label">
                          <input type="checkbox" defaultChecked />
                          <span className="toggle-slider"></span>
                          <span className="toggle-text">Новости платформы</span>
                        </label>

                      </div>
                    </div>

                    <div className="notification-category">
                      <h3>Push уведомления</h3>
                      <div className="notification-options">

                        <label className="toggle-label">
                          <input type="checkbox" defaultChecked />
                          <span className="toggle-slider"></span>
                          <span className="toggle-text">Напоминания о дедлайнах</span>
                        </label>

                        <label className="toggle-label">
                          <input type="checkbox" />
                          <span className="toggle-slider"></span>
                          <span className="toggle-text">Начало занятий</span>
                        </label>

                        <label className="toggle-label">
                          <input type="checkbox" defaultChecked />
                          <span className="toggle-slider"></span>
                          <span className="toggle-text">Личные сообщения</span>
                        </label>

                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* PRIVACY */}
              {activeSection === "privacy" && (
                <section className="profile-section active">
                  <h2 className="profile-section-title">Конфиденциальность</h2>

                  <div className="privacy-settings">

                    <div className="privacy-item">
                      <h3>Видимость профиля</h3>
                      <div className="privacy-options">

                        <label className="toggle-label">
                          <input type="checkbox" defaultChecked />
                          <span className="toggle-slider"></span>
                          <span className="toggle-text">Показывать мой профиль другим студентам</span>
                        </label>

                        <label className="toggle-label">
                          <input type="checkbox" />
                          <span className="toggle-slider"></span>
                          <span className="toggle-text">Показывать прогресс обучения</span>
                        </label>

                        <label className="toggle-label">
                          <input type="checkbox" defaultChecked />
                          <span className="toggle-slider"></span>
                          <span className="toggle-text">Показывать сертификаты</span>
                        </label>

                      </div>
                    </div>

                    <div className="privacy-item">
                      <h3>Данные аккаунта</h3>

                      <div className="data-actions">
                        <button className="data-export-btn button button--empty">
                          <span>Экспорт данных</span>
                        </button>

                        <button className="data-delete-btn button button--empty">
                          <span>Удалить аккаунт</span>
                        </button>
                      </div>

                      <p className="data-warning">
                        Внимание: удаление аккаунта невозможно отменить. Все ваши данные будут безвозвратно удалены.
                      </p>

                    </div>

                  </div>
                </section>
              )}

            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container">
          <p>&copy; 2024 Онлайн-школа Ilyukhi Nevduplenysha. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
}
