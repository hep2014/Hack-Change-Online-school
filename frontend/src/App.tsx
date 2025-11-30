import { BrowserRouter, Routes, Route } from "react-router-dom";

// Страницы
import MainPage from "./pages/MainPage";
import Login from "./pages/Login";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import DashboardPage from "./pages/DashboardPage";
import DashboardTeacherPage from "./pages/DashboardTeacherPage";
import ProfilePage from "./pages/ProfilePage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Главная */}
        <Route path="/" element={<MainPage />} />

        {/* Авторизация */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Кабинеты */}
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashboard-teacher" element={<DashboardTeacherPage />} />

        {/* Профиль */}
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </BrowserRouter>
  );
}
