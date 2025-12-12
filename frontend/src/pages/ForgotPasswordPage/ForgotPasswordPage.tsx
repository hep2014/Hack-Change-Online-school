import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./ForgotPasswordPage.module.css";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [chatId, setChatId] = useState("");
  const [step, setStep] = useState(1); // 1 — email, 2 — QR, 3 — chat_id
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  // chat_id должен быть положительным числом
  const validateChatId = (id: string) => /^[0-9]{5,15}$/.test(id);

  const checkEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/auth/check-email?email=" + email);
      const data = await res.json();

      if (!res.ok || !data.exists) {
        throw new Error("Пользователь с таким email не найден");
      }

      // Email существует → показываем QR
      setStep(2);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const goToTelegramInput = () => {
    setError(null);
    setStep(3);
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateChatId(chatId)) {
      return setError("Chat_id должен содержать только цифры.");
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          chat_id: chatId,   // ← теперь отправляем chat_id
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Ошибка восстановления");

      setDone(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // === Шаг 4: паролёк отправлен ===
  if (done) {
    return (
      <main className={styles.forgotPage}>
        <div className={styles.container}>
          <div className={styles.block}>
            <h1 className={styles.title}>Пароль отправлен</h1>
            <p className={styles.subtitle}>
              Временный пароль отправлен в Telegram пользователю с chat_id:{" "}
              <strong>{chatId}</strong>
            </p>
            <Link className={styles.backBtn} to="/login">Перейти ко входу</Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.forgotPage}>
      <div className={styles.container}>
        <div className={styles.block}>
          <h1 className={styles.title}>Восстановление пароля</h1>

          {/* ——— ШАГ 1: ВВОД EMAIL ——— */}
          {step === 1 && (
            <>
              <p className={styles.subtitle}>Введите email, указанный при регистрации.</p>

              {error && <div className={styles.error}>{error}</div>}

              <form onSubmit={checkEmail} className={styles.form}>
                <label className={styles.label}>
                  Email
                  <input
                    className={styles.input}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </label>

                <button className={styles.btn} disabled={loading}>
                  {loading ? "Проверяем..." : "Продолжить"}
                </button>
              </form>
            </>
          )}

          {/* ——— ШАГ 2: QR-КОД ——— */}
          {step === 2 && (
            <>
              <p className={styles.subtitle}>
                Email найден.
                <br /> Отсканируйте QR-код и нажмите /start в Telegram-боте.
              </p>

              <div className={styles.qrBox}>
                <img src="/qr.png" className={styles.qr} alt="QR code" />
              </div>

              <button className={styles.btn} onClick={goToTelegramInput}>
                Я отсканировал
              </button>
            </>
          )}

          {/* ——— ШАГ 3: ВВОД CHAT_ID ——— */}
          {step === 3 && (
            <>
              <p className={styles.subtitle}>Введите ваш chat_id от Telegram-бота.</p>

              {error && <div className={styles.error}>{error}</div>}

              <form onSubmit={handleReset} className={styles.form}>
                <label className={styles.label}>
                  Chat_id (только цифры)
                  <input
                    className={styles.input}
                    value={chatId}
                    onChange={(e) => setChatId(e.target.value)}
                    placeholder="Например: 123456789"
                    required
                  />
                </label>

                <button className={styles.btn} disabled={loading}>
                  {loading ? "Отправляем..." : "Сбросить пароль"}
                </button>
              </form>
            </>
          )}

          <div className={styles.links}>
            <Link to="/login">← Вернуться к входу</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
