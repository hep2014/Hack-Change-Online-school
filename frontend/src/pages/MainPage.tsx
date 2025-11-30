export default function App() {
  return (
    <div className="wrapper">
      {/* Шапка */}
      <header className="header">
        <div className="container">
          <div className="header__inner">
            <a className="header__logo" href="/">
              <img src="/images/logo.svg" alt="Логотип" />
            </a>

            <nav className="header__nav">
              <ul className="header__nav-list">
                <li><a href="#courses">Курсы</a></li>
                <li><a href="#about">О школе</a></li>
                <li><a href="#teachers">Преподаватели</a></li>
                <li><a href="/login" className="header__nav-link">Мои курсы</a></li>
                <li><a href="/dashboard" className="header__nav-link">ЛК студента</a></li>
                <li><a href="/dashboard-teacher" className="header__nav-link">ЛК препода</a></li>
              </ul>
            </nav>

            <div className="header__auth">
              <a href="/login" className="header__login">Войти</a>
            </div>
          </div>
        </div>
      </header>

      {/* Герой-секция */}
      <section className="hero">
        <div className="container">
          <h1 className="hero__title">Онлайн-школа Ilyukhi Nevduplenysha</h1>
          <p className="hero__subtitle">Краткое описание/слоган</p>
          <a href="#courses" className="hero__btn button">Купить курс</a>
        </div>
      </section>

      {/* Курсы */}
      <section id="courses" className="courses">
        <div className="container">
          <h2 className="section-title">Наши курсы</h2>

          <div className="courses__grid">

            {/* ------ Курс 1 ------ */}
            <div className="course-card">
              <div className="course-card__image">
                <img src="/images/directions/1.jpg" alt="Web Pentesting" />
                <div className="course-level course-level--advanced">Advanced</div>
              </div>

              <div className="course-card__content">
                <span className="course-card__tag">Безопасность</span>
                <h3 className="course-card__title">Web Penetration Testing</h3>
                <p className="course-card__description">
                  Освойте методы этичного взлома и тестирования безопасности веб-приложений.
                </p>
                <div className="course-card__meta">
                  <span className="course-duration">⏱ 4 месяца</span>
                  <span className="course-price">💰 35 000 ₽</span>
                </div>
                <a href="#" className="course-card__link">Подробнее</a>
              </div>
            </div>

            {/* ------ Курс 2 ------ */}
            <div className="course-card">
              <div className="course-card__image">
                <img src="/images/directions/2.jpg" alt="Frontend Development" />
                <div className="course-level course-level--middle">Middle</div>
              </div>

              <div className="course-card__content">
                <span className="course-card__tag">Frontend</span>
                <h3 className="course-card__title">Advanced React & TypeScript</h3>
                <p className="course-card__description">
                  Создавайте масштабируемые приложения с React, Redux и TypeScript.
                </p>
                <div className="course-card__meta">
                  <span className="course-duration">⏱ 5 месяцев</span>
                  <span className="course-price">💰 28 000 ₽</span>
                </div>
                <a href="#" className="course-card__link">Подробнее</a>
              </div>
            </div>

            {/* ------ Курс 3 ------ */}
            <div className="course-card">
              <div className="course-card__image">
                <img src="/images/directions/3.jpg" alt="Backend Development" />
                <div className="course-level course-level--junior">Junior</div>
              </div>

              <div className="course-card__content">
                <span className="course-card__tag">Backend</span>
                <h3 className="course-card__title">Node.js Fundamentals</h3>
                <p className="course-card__description">
                  Бэкенд-разработка на Node.js, Express и основы MongoDB.
                </p>
                <div className="course-card__meta">
                  <span className="course-duration">⏱ 3 месяца</span>
                  <span className="course-price">💰 20 000 ₽</span>
                </div>
                <a href="#" className="course-card__link">Подробнее</a>
              </div>
            </div>

            {/* ...все остальные курсы ты можешь вставить по аналогии — структура одинакова ... */}

          </div>
        </div>
      </section>
    </div>
  );
}

