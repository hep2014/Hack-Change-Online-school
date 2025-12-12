import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";

import MainPage from "./pages/MainPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import DashboardTeacher from "./pages/DashboardTeacher/DashboardTeacher";
import HeaderPrivate from "./components/HeaderPrivate";

function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  const isPrivate = location.pathname.startsWith("/dashboard-teacher");

  return (
    <>
      {isPrivate ? <HeaderPrivate /> : <Header />}
      {children}
      {!isPrivate && <Footer />} 
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>

        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage/>} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/dashboard-teacher" element={<DashboardTeacher />} />
        </Routes>

      </Layout>
    </BrowserRouter>
  );
}
