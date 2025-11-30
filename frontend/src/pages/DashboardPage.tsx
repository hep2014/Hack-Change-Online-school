import "../css/reset.css";
import "../css/style.css";

export default function DashboardPage() {
  return (
    <div className="wrapper dashboard-wrapper">

      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar__header">
          <h2>Личный кабинет</h2>
        </div>

        <nav className="sidebar__nav">
          <ul className="sidebar__nav-list">
            <li><a href="#dashboard" className="sidebar__link active">📊 Дашборд</a></li>
            <li><a href="#my-courses" className="sidebar__link">🎓 Мои курсы</a></li>
            <li><a href="#my-assignments" className="sidebar__link">📝 Мои задания</a></li>
            <li><a href="#schedule" className="sidebar__link">📅 Расписание</a></li>
            <li><a href="#my-progress" className="sidebar__link">📈 Мой прогресс</a></li>
            <li><a href="#materials" className="sidebar__link">📚 Материалы</a></li>
            <li><a href="#payments" className="sidebar__link">💳 Оплаты</a></li>
            <li><a href="#support" className="sidebar__link">❓ Техподдержка</a></li>
          </ul>
        </nav>
      </aside>

      {/* MAIN */}
      <main className="dashboard-main">

        {/* HEADER */}
        <header className="dashboard-header">
          <div className="dashboard-header__left">
            <button className="menu-toggle">☰</button>
            <h1>Добро пожаловать, Иван!</h1>
          </div>

          <div className="dashboard-header__right">
            <div className="user-profile">
              <a href="/profile" className="user-profile-link">
                <img src="/images/icons/avatar.jpg" alt="Аватар" className="user-avatar" />
                <span className="user-name">Иван Иванов</span>
              </a>
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <div className="dashboard-content">

          {/* DASHBOARD SECTION */}
          <section id="dashboard" className="dashboard-section">
            <h2 className="section-title">Обзор</h2>

            <div className="dashboard-stats">

              <div className="stat-card">
                <div className="stat-card__icon">📚</div>
                <div className="stat-card__content">
                  <div className="stat-card__value">3</div>
                  <div className="stat-card__label">Активных курса</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-card__icon">⏱️</div>
                <div className="stat-card__content">
                  <div className="stat-card__value">12</div>
                  <div className="stat-card__label">Часов обучения</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-card__icon">📝</div>
                <div className="stat-card__content">
                  <div className="stat-card__value">5</div>
                  <div className="stat-card__label">Заданий на проверке</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-card__icon">⭐</div>
                <div className="stat-card__content">
                  <div className="stat-card__value">78%</div>
                  <div className="stat-card__label">Средняя успеваемость</div>
                </div>
              </div>

            </div>
          </section>

          {/* MY COURSES */}
          <section id="my-courses" className="dashboard-section">
            <h2 className="section-title">Мои курсы</h2>

            <div className="courses-grid">

              <div className="my-course-card">
                <div className="course-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: "65%" }}></div>
                  </div>
                  <span className="progress-text">65% завершено</span>
                </div>
                <h3>Web Penetration Testing</h3>
                <p>Следующее занятие: 15 дек</p>
                <a href="#" className="course-continue-btn">Продолжить</a>
              </div>

              <div className="my-course-card">
                <div className="course-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: "30%" }}></div>
                  </div>
                  <span className="progress-text">30% завершено</span>
                </div>
                <h3>Advanced React & TypeScript</h3>
                <p>Следующее занятие: 16 дек</p>
                <a href="#" className="course-continue-btn">Продолжить</a>
              </div>

              <div className="my-course-card">
                <div className="course-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: "45%" }}></div>
                  </div>
                  <span className="progress-text">45% завершено</span>
                </div>
                <h3>Node.js Fundamentals</h3>
                <p>Следующее занятие: 17 дек</p>
                <a href="#" className="course-continue-btn">Продолжить</a>
              </div>

            </div>
          </section>

          {/* ASSIGNMENTS */}
          <section id="my-assignments" className="dashboard-section">
            <h2 className="section-title">Мои задания</h2>

            <div className="assignments-list">

              <div className="assignment-item urgent">
                <div className="assignment-info">
                  <h4>Лабы по тибимзи ебучие</h4>
                  <p>Курс: Web Penetration Testing</p>
                  <span className="deadline">Дедлайн: завтра</span>
                </div>
                <button className="assignment-btn">Выполнить</button>
              </div>

              <div className="assignment-item">
                <div className="assignment-info">
                  <h4>Тест по модулю 3</h4>
                  <p>Курс: Advanced React & TypeScript</p>
                  <span className="deadline">Дедлайн: 3 дня</span>
                </div>
                <button className="assignment-btn">Выполнить</button>
              </div>

              <div className="assignment-item">
                <div className="assignment-info">
                  <h4>Практическая работа №5</h4>
                  <p>Курс: Node.js Fundamentals</p>
                  <span className="deadline">Дедлайн: 5 дней</span>
                </div>
                <button className="assignment-btn">Выполнить</button>
              </div>

            </div>
          </section>

          {/* SCHEDULE */}
          <section id="schedule" className="dashboard-section">
            <h2 className="section-title">Расписание</h2>

            <div className="schedule-calendar">

              <div className="calendar-header">
                <button className="calendar-nav">←</button>
                <h3>Декабрь 2024</h3>
                <button className="calendar-nav">→</button>
              </div>

              <div className="calendar-week">

                <div className="calendar-day">
                  <div className="day-header">Пн 16</div>
                  <div className="day-events">
                    <div className="event">React лекция<br />18:00-19:30</div>
                  </div>
                </div>

                <div className="calendar-day">
                  <div className="day-header">Вт 17</div>
                  <div className="day-events">
                    <div className="event">Node.js практика<br />19:00-20:30</div>
                  </div>
                </div>

                <div className="calendar-day today">
                  <div className="day-header">Ср 18</div>
                  <div className="day-events">
                    <div className="event">Pentesting воркшоп<br />17:30-19:00</div>
                  </div>
                </div>

                <div className="calendar-day">
                  <div className="day-header">Чт 19</div>
                  <div className="day-events"></div>
                </div>

                <div className="calendar-day">
                  <div className="day-header">Пт 20</div>
                  <div className="day-events">
                    <div className="event">Консультация<br />16:00-17:00</div>
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* PROGRESS */}
          <section id="my-progress" className="dashboard-section">
            <h2 className="section-title">Мой прогресс</h2>

            <div className="progress-stats">

              <div className="progress-stat">
                <div className="stat-circle">
                  <span className="stat-value">78%</span>
                </div>
                <span className="stat-label">Средняя успеваемость</span>
              </div>

              <div className="progress-stat">
                <div className="stat-circle">
                  <span className="stat-value">12</span>
                </div>
                <span className="stat-label">Выполнено заданий</span>
              </div>

              <div className="progress-stat">
                <div className="stat-circle">
                  <span className="stat-value">24</span>
                </div>
                <span className="stat-label">Часов обучения</span>
              </div>

            </div>

            <div className="progress-chart">
              <h3>Прогресс по курсам</h3>

              <div className="chart-bars">

                <div className="chart-bar">
                  <div className="chart-bar__label">Web Pentesting</div>
                  <div className="chart-bar__track">
                    <div className="chart-bar__fill" style={{ width: "65%" }}></div>
                  </div>
                  <div className="chart-bar__value">65%</div>
                </div>

                <div className="chart-bar">
                  <div className="chart-bar__label">React & TypeScript</div>
                  <div className="chart-bar__track">
                    <div className="chart-bar__fill" style={{ width: "30%" }}></div>
                  </div>
                  <div className="chart-bar__value">30%</div>
                </div>

                <div className="chart-bar">
                  <div className="chart-bar__label">Node.js</div>
                  <div className="chart-bar__track">
                    <div className="chart-bar__fill" style={{ width: "45%" }}></div>
                  </div>
                  <div className="chart-bar__value">45%</div>
                </div>

              </div>
            </div>
          </section>

          {/* MATERIALS */}
          <section id="materials" className="dashboard-section">
            <h2 className="section-title">Материалы</h2>

            <div className="materials-grid">

              <div className="material-card">
                <div className="material-icon">📖</div>
                <h3>Конспекты лекций</h3>
                <p>PDF материалы всех пройденных лекций</p>
                <a href="#" className="material-link">Открыть</a>
              </div>

              <div className="material-card">
                <div className="material-icon">🎬</div>
                <h3>Видео записи</h3>
                <p>Записи всех онлайн занятий</p>
                <a href="#" className="material-link">Смотреть</a>
              </div>

              <div className="material-card">
                <div className="material-icon">💻</div>
                <h3>Практические задания</h3>
                <p>Шаблоны кода и упражнения</p>
                <a href="#" className="material-link">Скачать</a>
              </div>

              <div className="material-card">
                <div className="material-icon">📚</div>
                <h3>Дополнительная литература</h3>
                <p>Книги и статьи по теме</p>
                <a href="#" className="material-link">Изучить</a>
              </div>

            </div>
          </section>

          {/* PAYMENTS */}
          <section id="payments" className="dashboard-section">
            <h2 className="section-title">Оплаты</h2>

            <div className="payments-history">

              <div className="payment-item">
                <div className="payment-info">
                  <h4>Web Penetration Testing</h4>
                  <p>Дата оплаты: 15.11.2024</p>
                  <span className="payment-amount">35 000 ₽</span>
                </div>
                <span className="payment-status paid">Оплачено</span>
              </div>

              <div className="payment-item">
                <div className="payment-info">
                  <h4>Advanced React & TypeScript</h4>
                  <p>Дата оплаты: 10.10.2024</p>
                  <span className="payment-amount">28 000 ₽</span>
                </div>
                <span className="payment-status paid">Оплачено</span>
              </div>

              <div className="payment-item">
                <div className="payment-info">
                  <h4>Node.js Fundamentals</h4>
                  <p>Дата оплаты: 05.09.2024</p>
                  <span className="payment-amount">20 000 ₽</span>
                </div>
                <span className="payment-status paid">Оплачено</span>
              </div>

            </div>
          </section>

          {/* SUPPORT */}
          <section id="support" className="dashboard-section">
            <h2 className="section-title">Техподдержка</h2>

            <div className="support-content">

              <div className="support-info">
                <h3>Нужна помощь?</h3>
                <p>Мы всегда готовы помочь вам с любыми вопросами</p>

                <div className="support-contacts">

                  <div className="contact-item">
                    <div className="contact-icon">📧</div>
                    <div className="contact-info">
                      <strong>Email</strong>
                      <p>support@ilyukhi-school.ru</p>
                    </div>
                  </div>

                  <div className="contact-item">
                    <div className="contact-icon">📞</div>
                    <div className="contact-info">
                      <strong>Телефон</strong>
                      <p>+7 (999) 123-45-67</p>
                    </div>
                  </div>

                  <div className="contact-item">
                    <div className="contact-icon">🕐</div>
                    <div className="contact-info">
                      <strong>Время работы</strong>
                      <p>Пн-Пт: 9:00-18:00 (МСК)</p>
                    </div>
                  </div>

                </div>
              </div>

              <div className="support-form">
                <h3>Написать в поддержку</h3>
                <form className="message-form">

                  <div className="form-group">
                    <label className="form-label">Тема</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Опишите вашу проблему"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Сообщение</label>
                    <textarea
                      className="form-textarea"
                      placeholder="Подробно опишите вашу проблему..."
                      rows={5}
                    ></textarea>
                  </div>

                  <button type="submit" className="support-submit-btn button">
                    Отправить сообщение
                  </button>

                </form>
              </div>

            </div>

          </section>

        </div>
      </main>
    </div>
  );
}
