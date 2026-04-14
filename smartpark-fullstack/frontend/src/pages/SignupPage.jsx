import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';
import { useAuth } from '../context/AuthContext';
import { validateEmailOrPhone, validateStrongPassword } from '../utils/validators';

export default function SignupPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ name: '', identity: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (!form.name.trim()) return setError('Нэрээ оруулна уу.');
    if (!validateEmailOrPhone(form.identity)) return setError('Зөв имэйл эсвэл 8 оронтой утас оруулна уу.');
    if (!validateStrongPassword(form.password)) {
      return setError('Нууц үг дор хаяж 8 тэмдэгттэй, том үсэг, жижиг үсэг, тоо, тусгай тэмдэгт агуулсан байх ёстой.');
    }
    if (form.password !== form.confirmPassword) return setError('Нууц үг таарахгүй байна.');

    try {
      setLoading(true);
      const data = await authApi.signup(form);
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
        <div className="auth-badge">Create account</div>
        <h1>Шинэ бүртгэл</h1>
        <p>Хэрэглэгчийн бүртгэл үүсгээд SmartPark-ийн зогсоолын мэдээлэл, захиалгыг ашиглаарай.</p>

        {error && <div className="error-box">{error}</div>}

        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="field">
            <label>Нэр</label>
            <input autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="field">
            <label>Имэйл эсвэл Утас</label>
            <input autoComplete="username" value={form.identity} onChange={(e) => setForm({ ...form, identity: e.target.value })} />
          </div>
          <div className="field">
            <label>Нууц үг</label>
            <input type="password" autoComplete="new-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
          <div className="field">
            <label>Нууц үг баталгаажуулах</label>
            <input type="password" autoComplete="new-password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} />
          </div>
          <button className="btn btn-primary btn-block" disabled={loading}>{loading ? 'Бүртгэж байна...' : 'Бүртгүүлэх'}</button>
        </form>

        <p className="auth-footer">
          Бүртгэлтэй юу?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 800 }}>
            Нэвтрэх
          </Link>
        </p>
      </div>
    </div>
  );
}
