import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';
import { useAuth } from '../context/AuthContext';
import { validateEmailOrPhone } from '../utils/validators';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ identity: 'bold@mail.mn', password: 'Password123!' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (!validateEmailOrPhone(form.identity)) {
      setError('Зөв имэйл эсвэл 8 оронтой утас оруулна уу.');
      return;
    }

    if (!form.password) {
      setError('Нууц үгээ оруулна уу.');
      return;
    }

    try {
      setLoading(true);
      const data = await authApi.login(form);
      login(data.token, data.user);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <h1>Тавтай морил</h1>
        <p>SmartPark систем рүү нэвтэрнэ үү.</p>

        {error && <div className="error-box">{error}</div>}

        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="field">
            <label>Имэйл эсвэл Утас</label>
            <input
              value={form.identity}
              onChange={(e) => setForm((prev) => ({ ...prev, identity: e.target.value }))}
              placeholder="example@mail.mn"
            />
          </div>

          <div className="field">
            <label>Нууц үг</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
              placeholder="••••••••"
            />
            <small>Demo: Password123!</small>
          </div>

          <button className="btn btn-primary" disabled={loading}>
            {loading ? 'Нэвтэрч байна...' : 'Нэвтрэх'}
          </button>
        </form>

        <p style={{ marginTop: 16 }}>
          Бүртгэлгүй юу? <Link to="/signup" style={{ color: 'var(--blue)', fontWeight: 700 }}>Бүртгүүлэх</Link>
        </p>
      </div>
    </div>
  );
}
