import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function MainLayout() {
  const { user } = useAuth();

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <div className="page-heading">
            <div className="brand">SmartPark</div>
            <div className="muted">Сайн байна уу, {user?.name}</div>
          </div>
          <span className="badge badge-blue">Realtime Parking</span>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <nav className="bottom-nav">
        <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          Нүүр
        </NavLink>
        <NavLink to="/orders" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          Захиалга
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          Профайл
        </NavLink>
        <NavLink to="/" className="nav-link">
          Хайх
        </NavLink>
      </nav>
    </div>
  );
}
