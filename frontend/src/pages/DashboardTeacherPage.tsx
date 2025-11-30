import React, { useEffect, useMemo, useState } from "react";

import "../css/reset.css";
import "../css/style.css";

type MaterialType = "file" | "text";

type CourseCode = "web-pentesting" | "react-typescript" | "nodejs";

type ResponseType = "file" | "text";

type WorkType = "file" | "text";
interface TeacherStats {
  activeCourses: number;
  students: number;
  worksToCheck: number;
  avgPerformance: number | null;
}

interface Material {
  id: number;
  name: string;
  course: CourseCode | "";
  type: MaterialType;
  fileType: string;
  size: string;
  access: boolean;
  icon: string;
}

interface Assignment {
  id: number;
  title: string;
  course: string;
  groups: string[];
  submitted: string;
  deadline: string;
}

interface WorkToCheck {
  id: number;
  title: string;
  course: string;
  student: string;
  deadline: string;
  type: WorkType;
  urgent: boolean;
}

interface MaterialFormState {
  name: string;
  course: CourseCode | "";
  type: MaterialType;
  access: boolean;
  file: File | null;
  text: string;
}

interface AssignmentFormState {
  course: CourseCode | "";
  groups: string[];
  title: string;
  description: string;
  responseType: ResponseType;
  maxScore: number;
  deadlineDate: string;
  deadlineTime: string;
  allowLateSubmission: boolean;
  notifyStudents: boolean;
}

interface GradingFormState {
  score: string;
  comment: string;
  action: "accept" | "revision";
}

const defaultMaterialForm: MaterialFormState = {
  name: "",
  course: "",
  type: "file",
  access: true,
  file: null,
  text: "",
};

const defaultAssignmentForm: AssignmentFormState = {
  course: "",
  groups: [],
  title: "",
  description: "",
  responseType: "file",
  maxScore: 10,
  deadlineDate: "",
  deadlineTime: "23:59",
  allowLateSubmission: false,
  notifyStudents: true,
};

const defaultGradingForm: GradingFormState = {
  score: "",
  comment: "",
  action: "accept",
};

const COURSE_LABELS: Record<CourseCode, string> = {
  "web-pentesting": "Web Penetration Testing",
  "react-typescript": "Advanced React & TypeScript",
  nodejs: "Node.js Fundamentals",
};

export default function TeacherDashboardPage() {
  const [activeSection, setActiveSection] = useState("teacher-dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [materials, setMaterials] = useState<Material[]>([
    {
      id: 1,
      name: "Лекция 1: Введение в Web Security",
      course: "web-pentesting",
      type: "file",
      fileType: "PDF",
      size: "2.4 MB",
      access: true,
      icon: "📖",
    },
    {
      id: 2,
      name: "Шпаргалка по React Hooks",
      course: "react-typescript",
      type: "text",
      fileType: "Текстовый материал",
      size: "",
      access: true,
      icon: "📝",
    },
    {
      id: 3,
      name: "Видео: Middleware в Express.js",
      course: "nodejs",
      type: "file",
      fileType: "Видео",
      size: "45.6 MB",
      access: false,
      icon: "🎬",
    },
  ]);

  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: 1,
      title: "Дипломный проект - Web Security",
      course: "Web Penetration Testing",
      groups: ["PT-2024-01"],
      submitted: "12/15",
      deadline: "25.12.2024",
    },
    {
      id: 2,
      title: "Тест по модулю 3 - React Hooks",
      course: "Advanced React & TypeScript",
      groups: ["RT-2024-02"],
      submitted: "8/12",
      deadline: "20.12.2024",
    },
    {
      id: 3,
      title: "Практическая работа №5 - Express.js",
      course: "Node.js Fundamentals",
      groups: ["NJ-2024-03"],
      submitted: "15/18",
      deadline: "18.12.2024",
    },
  ]);

  const [worksToCheck, setWorksToCheck] = useState<WorkToCheck[]>([
    {
      id: 1,
      title: "Дипломный проект - Иван Сидоров",
      course: "Web Penetration Testing",
      student: "Иван Сидоров",
      deadline: "2 дня",
      type: "file",
      urgent: true,
    },
    {
      id: 2,
      title: "Тест по модулю 3 - Мария Козлова",
      course: "Advanced React & TypeScript",
      student: "Мария Козлова",
      deadline: "5 дней",
      type: "text",
      urgent: false,
    },
    {
      id: 3,
      title: "Практическая работа №5 - Дмитрий Петров",
      course: "Node.js Fundamentals",
      student: "Дмитрий Петров",
      deadline: "3 дня",
      type: "file",
      urgent: false,
    },
  ]);

  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [showGradingModal, setShowGradingModal] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [currentWork, setCurrentWork] = useState<WorkToCheck | null>(null);

  const [materialForm, setMaterialForm] = useState<MaterialFormState>(defaultMaterialForm);
  const [assignmentForm, setAssignmentForm] = useState<AssignmentFormState>(defaultAssignmentForm);
  const [gradingForm, setGradingForm] = useState<GradingFormState>(defaultGradingForm);
  const [stats, setStats] = useState<TeacherStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Не найден токен авторизации");

      const res = await fetch("http://localhost:8000/teacher/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error(`Ошибка загрузки данных (${res.status})`);
      const data = await res.json();
      setStats(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  fetchStats();
}, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const nextWeekFormatted = nextWeek.toISOString().split("T")[0];
    setAssignmentForm((prev) => ({
      ...prev,
      deadlineDate: nextWeekFormatted,
    }));
  }, []);

  const formatDate = (date: Date) =>
    date.toLocaleDateString("ru-RU", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const handleAddMaterial = () => {
    setEditingMaterial(null);
    setMaterialForm(defaultMaterialForm);
    setShowMaterialModal(true);
  };

  const handleEditMaterial = (material: Material) => {
    setEditingMaterial(material);
    setMaterialForm({
      name: material.name,
      course: material.course,
      type: material.type,
      access: material.access,
      file: null,
      text: material.type === "text" ? "Текст материала..." : "",
    });
    setShowMaterialModal(true);
  };

  const handleDeleteMaterial = (id: number) => {
    if (window.confirm("Вы уверены, что хотите удалить этот материал?")) {
      setMaterials((prev) => prev.filter((material) => material.id !== id));
    }
  };

  const handleMaterialSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editingMaterial) {
      setMaterials((prev) =>
        prev.map((material) =>
          material.id === editingMaterial.id
            ? {
                ...material,
                ...materialForm,
                fileType: materialForm.type === "file" ? material.fileType || "Файл" : "Текстовый материал",
                size: materialForm.type === "file" ? material.size || "1.5 MB" : "",
                icon: materialForm.type === "file" ? material.icon || "📎" : "📝",
              }
            : material,
        ),
      );
    } else {
      const newMaterial: Material = {
        id: Date.now(),
        ...materialForm,
        course: (materialForm.course || "web-pentesting") as CourseCode,
        fileType: materialForm.type === "file" ? "Файл" : "Текстовый материал",
        size: materialForm.type === "file" ? "1.5 MB" : "",
        icon: materialForm.type === "file" ? "📎" : "📝",
      };
      setMaterials((prev) => [...prev, newMaterial]);
    }
    setShowMaterialModal(false);
  };

  const handleMaterialAccessChange = (id: number, access: boolean) => {
    setMaterials((prev) =>
      prev.map((material) => (material.id === id ? { ...material, access } : material)),
    );
  };

  const handleCreateAssignment = () => {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    setAssignmentForm({
      ...defaultAssignmentForm,
      deadlineDate: nextWeek.toISOString().split("T")[0],
    });
    setShowAssignmentModal(true);
  };

  const handleAssignmentSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newAssignment: Assignment = {
      id: Date.now(),
      title: assignmentForm.title,
      course: assignmentForm.course || "Не указан",
      groups: assignmentForm.groups,
      submitted: "0/0",
      deadline: `${assignmentForm.deadlineDate} ${assignmentForm.deadlineTime}`,
    };
    setAssignments((prev) => [...prev, newAssignment]);
    setShowAssignmentModal(false);
  };

  const handleDeleteAssignment = (id: number) => {
    if (window.confirm("Вы уверены, что хотите удалить это задание?")) {
      setAssignments((prev) => prev.filter((assignment) => assignment.id !== id));
    }
  };

  const handleCheckWork = (work: WorkToCheck) => {
    setCurrentWork(work);
    setGradingForm(defaultGradingForm);
    setShowGradingModal(true);
  };

  const handleGradingSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const nativeEvent = e.nativeEvent as SubmitEvent;
    const submitter = nativeEvent.submitter as HTMLButtonElement | null;
    const action = (submitter?.value as GradingFormState["action"]) || "accept";

    if (action === "accept" && !gradingForm.score) {
      window.alert("Введите оценку для принятия работы");
      return;
    }

    setGradingForm((prev) => ({ ...prev, action }));
    setWorksToCheck((prev) => prev.filter((work) => work.id !== currentWork?.id));
    setShowGradingModal(false);
  };

  const selectedCourseLabel = (course: CourseCode) => COURSE_LABELS[course];

  const formattedDate = useMemo(() => formatDate(currentDate), [currentDate]);
  if (loading) return <div>Загрузка...</div>;
  if (error) return <div className="error">{error}</div>;
  return (
    <>
    <div className="wrapper dashboard-wrapper">
      <aside className={`sidebar ${isSidebarOpen ? "sidebar--open" : ""}`}>
        <div className="sidebar__header">
          <h2>Кабинет преподавателя</h2>
        </div>

        <nav className="sidebar__nav">
          <ul className="sidebar__nav-list">
            <li>
              <a
                href="#teacher-dashboard"
                className={`sidebar__link ${activeSection === "teacher-dashboard" ? "active" : ""}`}
                onClick={() => handleSectionChange("teacher-dashboard")}
              >
                📊 Дашборд
              </a>
            </li>
            <li>
              <a
                href="#teacher-courses"
                className={`sidebar__link ${activeSection === "teacher-courses" ? "active" : ""}`}
                onClick={() => handleSectionChange("teacher-courses")}
              >
                🎓 Мои курсы
              </a>
            </li>
            <li>
              <a
                href="#teacher-groups"
                className={`sidebar__link ${activeSection === "teacher-groups" ? "active" : ""}`}
                onClick={() => handleSectionChange("teacher-groups")}
              >
                👥 Мои группы
              </a>
            </li>
            <li>
              <a
                href="#teacher-assignments"
                className={`sidebar__link ${activeSection === "teacher-assignments" ? "active" : ""}`}
                onClick={() => handleSectionChange("teacher-assignments")}
              >
                📝 Задания
              </a>
            </li>
            <li>
              <a
                href="#teacher-materials"
                className={`sidebar__link ${activeSection === "teacher-materials" ? "active" : ""}`}
                onClick={() => handleSectionChange("teacher-materials")}
              >
                📚 Материалы
              </a>
            </li>
            <li>
              <a
                href="#teacher-checking"
                className={`sidebar__link ${activeSection === "teacher-checking" ? "active" : ""}`}
                onClick={() => handleSectionChange("teacher-checking")}
              >
                ✅ Проверка работ
              </a>
            </li>
            <li>
              <a
                href="#teacher-schedule"
                className={`sidebar__link ${activeSection === "teacher-schedule" ? "active" : ""}`}
                onClick={() => handleSectionChange("teacher-schedule")}
              >
                📅 Расписание
              </a>
            </li>
            <li>
              <a
                href="#teacher-statistics"
                className={`sidebar__link ${activeSection === "teacher-statistics" ? "active" : ""}`}
                onClick={() => handleSectionChange("teacher-statistics")}
              >
                📈 Статистика
              </a>
            </li>
            <li>
              <a
                href="#teacher-profile"
                className={`sidebar__link ${activeSection === "teacher-profile" ? "active" : ""}`}
                onClick={() => handleSectionChange("teacher-profile")}
              >
                👤 Профиль
              </a>
            </li>
            <li>
              <a
                href="#teacher-support"
                className={`sidebar__link ${activeSection === "teacher-support" ? "active" : ""}`}
                onClick={() => handleSectionChange("teacher-support")}
              >
                ❓ Техподдержка
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div className="dashboard-header__left">
            <button className="menu-toggle" onClick={toggleSidebar}>
              ☰
            </button>
            <h1>Добро пожаловать, Алексей Петров!</h1>
            <span className="teacher-badge">Преподаватель</span>
            <span className="current-date">{formattedDate}</span>
          </div>

          <div className="dashboard-header__right">
            <div className="user-profile">
              <img src="/images/team/team/1.png" alt="Аватар" className="user-avatar" />
              <span className="user-name">Алексей Петров</span>
            </div>
          </div>
        </header>

        <div className="dashboard-content">
          <section id="teacher-dashboard" className="dashboard-section">
            <h2 className="section-title">Обзор</h2>

            <div className="dashboard-stats">
              <div className="stat-card">
                <div className="stat-card__icon">🎓</div>
                <div className="stat-card__content">
                  <div className="stat-card__value">{stats?.activeCourses ?? "–"}</div>
                  <div className="stat-card__label">Активных курса</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-card__icon">👥</div>
                <div className="stat-card__content">
                  <div className="stat-card__value">{stats?.students ?? "–"}</div>
                  <div className="stat-card__label">Студентов</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-card__icon">📝</div>
                <div className="stat-card__content">
                  <div className="stat-card__value">{stats?.worksToCheck ?? "–"}</div>
                  <div className="stat-card__label">Работ на проверке</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-card__icon">⏱️</div>
                <div className="stat-card__content">
                  <div className="stat-card__value">
                    {stats?.avgPerformance !== null && stats?.avgPerformance !== undefined
                      ? `${stats.avgPerformance.toFixed(1)}%`
                      : "–"}
                  </div>
                  <div className="stat-card__label">Средняя успеваемость</div>
                </div>
              </div>
            </div>

            <div className="teacher-quick-actions">
              <h3>Быстрые действия</h3>
              <div className="actions-grid">
                <button className="action-btn" onClick={handleCreateAssignment}>
                  <span className="action-icon">➕</span>
                  Создать задание
                </button>

                <button className="action-btn" onClick={() => handleSectionChange("teacher-checking")}>
                  <span className="action-icon">👁️</span>
                  Проверить работы
                </button>

                <button className="action-btn" onClick={handleAddMaterial}>
                  <span className="action-icon">📚</span>
                  Добавить материал
                </button>

                <button className="action-btn">
                  <span className="action-icon">💬</span>
                  Написать объявление
                </button>
              </div>
            </div>
          </section>

          <section id="teacher-materials" className="dashboard-section">
            <h2 className="section-title">Управление материалами</h2>

            <div className="materials-container">
              <div className="materials-header">
                <div className="materials-header__info">
                  <h3>Создавайте и редактируйте учебные материалы для студентов</h3>
                </div>
                <button className="add-material-btn button" onClick={handleAddMaterial}>
                  <span className="btn-icon">+</span>
                  Добавить материал
                </button>
              </div>

              <div className="materials-filters">
                <div className="search-box">
                  <input type="text" className="search-input" placeholder="Поиск материалов..." />
                  <span className="search-icon">🔍</span>
                </div>
                <select className="filter-select">
                  <option value="">Все курсы</option>
                  <option value="web-pentesting">Web Penetration Testing</option>
                  <option value="react-typescript">Advanced React & TypeScript</option>
                  <option value="nodejs">Node.js Fundamentals</option>
                </select>
                <select className="filter-select">
                  <option value="">Все типы</option>
                  <option value="file">Файлы</option>
                  <option value="text">Текстовые материалы</option>
                </select>
              </div>

              <div className="materials-list-container">
                <div className="materials-stats">
                  <span className="materials-count">
                    Материалов: <strong>{materials.length}</strong>
                  </span>
                  <span className="materials-total-size">
                    Общий размер: <strong>156 MB</strong>
                  </span>
                </div>

                <div className="materials-grid">
                  {materials.map((material) => (
                    <div key={material.id} className="material-item">
                      <div className="material-item__header">
                        <div className="material-icon">{material.icon}</div>
                        <div className="material-actions">
                          <button className="material-action-btn edit-btn" onClick={() => handleEditMaterial(material)}>
                            ✏️
                          </button>
                          <button className="material-action-btn delete-btn" onClick={() => handleDeleteMaterial(material.id)}>
                            🗑️
                          </button>
                        </div>
                      </div>
                      <div className="material-item__content">
                        <h3>{material.name}</h3>
                        <p className="material-meta">
                          <span className="material-course">
                                {material.course ? selectedCourseLabel(material.course) : "—"}
                              </span>
                          <span className="material-type">
                            {material.fileType}
                            {material.size && ` • ${material.size}`}
                          </span>
                        </p>
                        <div className="material-access">
                          <label className="toggle-label small">
                            <input
                              type="checkbox"
                              checked={material.access}
                              onChange={(e) => handleMaterialAccessChange(material.id, e.target.checked)}
                            />
                            <span className="toggle-slider"></span>
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section id="teacher-assignments" className="dashboard-section">
            <h2 className="section-title">Управление заданиями</h2>

            <div className="assignments-management">
              <div className="assignments-header">
                <h3>Мои задания</h3>
                <button className="create-assignment-btn button" onClick={handleCreateAssignment}>
                  ➕ Создать задание
                </button>
              </div>

              <div className="assignments-list">
                {assignments.map((assignment) => (
                  <div key={assignment.id} className="assignment-management-item">
                    <div className="assignment-info">
                      <h4>{assignment.title}</h4>
                      <p>Курс: {assignment.course}</p>
                      <div className="assignment-meta">
                        <span className="meta-item">📅 Дедлайн: {assignment.deadline}</span>
                        <span className="meta-item">👥 Группы: {assignment.groups.join(", ")}</span>
                        <span className="meta-item">📊 Сдано: {assignment.submitted}</span>
                      </div>
                    </div>
                    <div className="assignment-actions">
                      <button className="action-btn-small">Редактировать</button>
                      <button className="action-btn-small">Статистика</button>
                      <button className="action-btn-small danger" onClick={() => handleDeleteAssignment(assignment.id)}>
                        Удалить
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="teacher-checking" className="dashboard-section">
            <h2 className="section-title">Проверка работ</h2>

            <div className="checking-tabs">
              <button className="tab-btn active">Требуют проверки</button>
              <button className="tab-btn">Проверенные</button>
            </div>

            <div className="checking-list">
              {worksToCheck.map((work) => (
                <div key={work.id} className={`checking-item ${work.urgent ? "urgent" : ""}`}>
                  <div className="checking-item__header">
                    <div>
                      <span className="work-type">{work.type === "file" ? "Файл" : "Текст"}</span>
                      {work.urgent && <span className="urgent-label">Срочно</span>}
                    </div>
                    <span className="work-deadline">Срок: {work.deadline}</span>
                  </div>

                  <div className="checking-item__content">
                    <h3>{work.title}</h3>
                    <p>Курс: {work.course}</p>
                    <p>Студент: {work.student}</p>
                  </div>

                  <div className="checking-item__actions">
                    <button className="button" onClick={() => handleCheckWork(work)}>
                      Открыть для проверки
                    </button>
                    <button className="button button--empty">Скачать все</button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section id="teacher-schedule" className="dashboard-section">
            <h2 className="section-title">Расписание</h2>
            <div className="schedule-placeholder">Расписание занятий будет здесь</div>
          </section>

          <section id="teacher-statistics" className="dashboard-section">
            <h2 className="section-title">Статистика успеваемости</h2>
            <div className="statistics-placeholder">Графики и метрики</div>
          </section>

          <section id="teacher-profile" className="dashboard-section">
            <h2 className="section-title">Профиль преподавателя</h2>
            <div className="profile-placeholder">Данные профиля и настройки</div>
          </section>

          <section id="teacher-support" className="dashboard-section">
            <h2 className="section-title">Техподдержка</h2>
            <div className="support-placeholder">Центр помощи и база знаний</div>
          </section>
        </div>
      </main>

      {showMaterialModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingMaterial ? "Редактирование материала" : "Добавление нового материала"}</h2>
              <button className="modal-close" onClick={() => setShowMaterialModal(false)}>
                ×
              </button>
            </div>

            <form className="material-form" onSubmit={handleMaterialSubmit}>
              <div className="form-group">
                <label className="form-label">Название материала *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Введите название"
                  value={materialForm.name}
                  onChange={(e) => setMaterialForm({ ...materialForm, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Курс *</label>
                  <select
                    className="form-select"
                    value={materialForm.course}
                    onChange={(e) => setMaterialForm({ ...materialForm, course: e.target.value as CourseCode })}
                    required
                  >
                    <option value="">Выберите курс</option>
                    <option value="web-pentesting">Web Penetration Testing</option>
                    <option value="react-typescript">Advanced React & TypeScript</option>
                    <option value="nodejs">Node.js Fundamentals</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Тип материала *</label>
                  <div className="radio-group">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="materialType"
                        value="file"
                        checked={materialForm.type === "file"}
                        onChange={(e) => setMaterialForm({ ...materialForm, type: e.target.value as MaterialType })}
                      />
                      <span className="radio-custom"></span>
                      Файл
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="materialType"
                        value="text"
                        checked={materialForm.type === "text"}
                        onChange={(e) => setMaterialForm({ ...materialForm, type: e.target.value as MaterialType })}
                      />
                      <span className="radio-custom"></span>
                      Текст
                    </label>
                  </div>
                </div>
              </div>

              {materialForm.type === "file" && (
                <div className="form-group file-upload-group">
                  <label className="form-label">Загрузить файл *</label>
                  <div className="file-upload-area">
                    <span className="file-upload-icon">📎</span>
                    <p>
                      Перетащите файл сюда или <span className="file-browse">выберите</span>
                    </p>
                    <input
                      type="file"
                      className="file-input"
                      onChange={(event) =>
                        setMaterialForm({ ...materialForm, file: event.target.files?.[0] ?? null })
                      }
                    />
                    <small className="form-hint">
                      Поддерживаемые форматы: PDF, DOC, PPT, MP4 (макс. 100MB)
                    </small>
                  </div>
                </div>
              )}

              {materialForm.type === "text" && (
                <div className="form-group text-content-group">
                  <label className="form-label">Текст материала *</label>
                  <textarea
                    className="form-textarea"
                    placeholder="Введите текст материала..."
                    rows={8}
                    value={materialForm.text}
                    onChange={(e) => setMaterialForm({ ...materialForm, text: e.target.value })}
                  ></textarea>
                </div>
              )}

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={materialForm.access}
                    onChange={(e) => setMaterialForm({ ...materialForm, access: e.target.checked })}
                  />
                  <span className="checkmark"></span>
                  Доступно студентам
                </label>
              </div>

              <div className="form-actions">
                <button type="submit" className="save-btn button">
                  {editingMaterial ? "Обновить материал" : "Сохранить материал"}
                </button>
                <button type="button" className="cancel-btn button button--empty" onClick={() => setShowMaterialModal(false)}>
                  Отмена
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAssignmentModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Создание нового задания</h2>
              <button className="modal-close" onClick={() => setShowAssignmentModal(false)}>
                ×
              </button>
            </div>
            <form className="create-assignment-form" onSubmit={handleAssignmentSubmit}>
              <div className="form-section">
                <h3>Основная информация</h3>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Курс *</label>
                    <select
                      className="form-select"
                      value={assignmentForm.course}
                      onChange={(e) => setAssignmentForm({ ...assignmentForm, course: e.target.value as CourseCode })}
                      required
                    >
                      <option value="">Выберите курс</option>
                      <option value="web-pentesting">Web Penetration Testing</option>
                      <option value="react-typescript">Advanced React & TypeScript</option>
                      <option value="nodejs">Node.js Fundamentals</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Группы *</label>
                    <select
                      className="form-select"
                      multiple
                      required
                      value={assignmentForm.groups}
                      onChange={(e) =>
                        setAssignmentForm({
                          ...assignmentForm,
                          groups: Array.prototype.slice
                            .call(e.target.selectedOptions)
                            .map((option: HTMLOptionElement) => option.value),
                        })
                      }
                    >
                      <option value="PT-2024-01">PT-2024-01</option>
                      <option value="RT-2024-02">RT-2024-02</option>
                      <option value="NJ-2024-03">NJ-2024-03</option>
                    </select>
                    <small className="form-hint">Для выбора нескольких групп удерживайте Ctrl</small>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Название задания *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Введите название задания"
                    value={assignmentForm.title}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, title: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Описание задания *</label>
                  <textarea
                    className="form-textarea"
                    placeholder="Опишите задание, требования и критерии оценки..."
                    rows={5}
                    value={assignmentForm.description}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, description: e.target.value })}
                    required
                  ></textarea>
                </div>
              </div>

              <div className="form-section">
                <h3>Настройки задания</h3>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Тип ответа *</label>
                    <div className="radio-group vertical">
                      <label className="radio-label">
                        <input
                          type="radio"
                          name="responseType"
                          value="file"
                          checked={assignmentForm.responseType === "file"}
                          onChange={(e) => setAssignmentForm({ ...assignmentForm, responseType: e.target.value as ResponseType })}
                        />
                        <span className="radio-custom"></span>
                        Файловая загрузка
                      </label>
                      <label className="radio-label">
                        <input
                          type="radio"
                          name="responseType"
                          value="text"
                          checked={assignmentForm.responseType === "text"}
                          onChange={(e) => setAssignmentForm({ ...assignmentForm, responseType: e.target.value as ResponseType })}
                        />
                        <span className="radio-custom"></span>
                        Текстовый ответ
                      </label>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Максимальный балл *</label>
                    <input
                      type="number"
                      className="form-input"
                      min={1}
                      max={100}
                      value={assignmentForm.maxScore}
                      onChange={(e) =>
                        setAssignmentForm({ ...assignmentForm, maxScore: parseInt(e.target.value, 10) || 0 })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Дата дедлайна *</label>
                    <input
                      type="date"
                      className="form-input"
                      value={assignmentForm.deadlineDate}
                      onChange={(e) => setAssignmentForm({ ...assignmentForm, deadlineDate: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Время дедлайна *</label>
                    <input
                      type="time"
                      className="form-input"
                      value={assignmentForm.deadlineTime}
                      onChange={(e) => setAssignmentForm({ ...assignmentForm, deadlineTime: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Дополнительные настройки</h3>

                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={assignmentForm.allowLateSubmission}
                      onChange={(e) => setAssignmentForm({ ...assignmentForm, allowLateSubmission: e.target.checked })}
                    />
                    <span className="checkmark"></span>
                    Разрешить сдачу после дедлайна
                  </label>
                </div>

                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={assignmentForm.notifyStudents}
                      onChange={(e) => setAssignmentForm({ ...assignmentForm, notifyStudents: e.target.checked })}
                    />
                    <span className="checkmark"></span>
                    Уведомить студентов о новом задании
                  </label>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="create-btn button">
                  Создать задание
                </button>
                <button type="button" className="cancel-btn button button--empty" onClick={() => setShowAssignmentModal(false)}>
                  Отмена
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showGradingModal && currentWork && (
        <div className="modal-overlay">
          <div className="modal-content large">
            <div className="modal-header">
              <h2>Проверка работы</h2>
              <button className="modal-close" onClick={() => setShowGradingModal(false)}>
                ×
              </button>
            </div>

            <div className="grading-container">
              <div className="work-details">
                <h3>{currentWork.title}</h3>
                <div className="work-meta-info">
                  <p>
                    <strong>Студент:</strong> {currentWork.student}
                  </p>
                  <p>
                    <strong>Курс:</strong> {currentWork.course}
                  </p>
                  <p>
                    <strong>Тип ответа:</strong> {currentWork.type === "file" ? "Файловая загрузка" : "Текстовый ответ"}
                  </p>
                </div>
              </div>

              <div className="work-preview">
                <h4>Работа студента</h4>
                <div className="preview-content">
                  {currentWork.type === "file" ? (
                    <div className="file-preview">
                      <div className="file-info">
                        <span className="file-icon">📎</span>
                        <div className="file-details">
                          <strong>project_files.zip</strong>
                          <span>2.4 MB</span>
                        </div>
                      </div>
                      <button className="download-btn button button--empty">Скачать</button>
                    </div>
                  ) : (
                    <div className="text-preview">
                      <div className="text-content">
                        <p>В данном проекте я реализовал систему безопасности для веб-приложения...</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <form className="grading-form" onSubmit={handleGradingSubmit}>
                <div className="form-group">
                  <label className="form-label">Оценка *</label>
                  <div className="score-input-container">
                    <input
                      type="number"
                      className="form-input"
                      min={0}
                      max={10}
                      placeholder="0"
                      value={gradingForm.score}
                      onChange={(e) => setGradingForm({ ...gradingForm, score: e.target.value })}
                    />
                    <span className="score-max">/ 10</span>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Комментарий и обратная связь</label>
                  <textarea
                    className="form-textarea"
                    placeholder="Напишите комментарий для студента..."
                    rows={6}
                    value={gradingForm.comment}
                    onChange={(e) => setGradingForm({ ...gradingForm, comment: e.target.value })}
                  ></textarea>
                </div>

                <div className="grading-actions">
                  <button type="submit" name="action" value="accept" className="accept-btn button">
                    ✅ Принять работу
                  </button>
                  <button type="submit" name="action" value="revision" className="revision-btn button button--empty">
                    🔄 Вернуть на доработку
                  </button>
                  <button type="button" className="save-draft-btn button button--empty">
                    💾 Сохранить черновик
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  </>
  );
}