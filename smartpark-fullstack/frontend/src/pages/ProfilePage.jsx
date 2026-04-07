import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { user, logout } = useAuth();

  return (
    <div className="page stack">
      <section className="hero">
        <h2 style={{ marginTop: 0 }}>{user?.name}</h2>
        <div>{user?.identity}</div>
      </section>

      <div className="card stack">
        <div className="row-between"><span className="muted">Role</span><strong>{user?.role}</strong></div>
        <div className="row-between"><span className="muted">User ID</span><strong>{user?.id}</strong></div>
        <button className="btn btn-danger" onClick={logout}>Гарах</button>
      </div>
    </div>
  );
}
