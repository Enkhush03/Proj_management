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
        <div className="auth-badge">SmartPark Access</div>
        <h1>Тавтай морил</h1>
        <p>SmartPark систем рүү нэвтэрч, ойролцоох зогсоолуудаа нэг дороос хянаарай.</p>

        {error && <div className="error-box">{error}</div>}

        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="field">
            <label>Имэйл эсвэл Утас</label>
            <input
              autoComplete="username"
              value={form.identity}
              onChange={(e) => setForm((prev) => ({ ...prev, identity: e.target.value }))}
              placeholder="example@mail.mn"
            />
          </div>

          <div className="field">
            <label>Нууц үг</label>
            <input
              type="password"
              autoComplete="current-password"
              value={form.password}
              onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
              placeholder="••••••••"
            />
            <small>Demo: Password123!</small>
          </div>

          <button className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Нэвтэрч байна...' : 'Нэвтрэх'}
          </button>
        </form>

        <p className="auth-footer">
          Бүртгэлгүй юу?{' '}
          <Link to="/signup" style={{ color: 'var(--primary)', fontWeight: 800 }}>
            Бүртгүүлэх
          </Link>
        </p>
      </div>
    </div>
  );
}
