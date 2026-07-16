import { useState } from 'react';
import { LayoutDashboard, Wrench, Tags, ShoppingCart, Users, LogOut, FlaskConical } from 'lucide-react';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Tools from './pages/Tools';
import Categories from './pages/Categories';
import Shopping from './pages/Shopping';
import UsersPage from './pages/UsersPage';
import { ClipboardList } from 'lucide-react';
import JobTypes from './pages/JobTypes';
import TestDemo from './pages/TestDemo';
const menu = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'tools', label: 'Herramientas', icon: Wrench },
  { key: 'categories', label: 'Categorías', icon: Tags },
  { key: 'shopping', label: 'Lista de compras', icon: ShoppingCart },
  { key: 'jobTypes', label: 'Tipos de trabajo', icon: ClipboardList },
  { key: 'testDemo', label: 'Prueba automática', icon: FlaskConical },
  { key: 'users', label: 'Usuarios', icon: Users, adminOnly: true }
];

export default function App() {
  const { user, loading, logout } = useAuth();
  const [page, setPage] = useState('dashboard');

  if (window.location.hash === '#test-demo') {
    return (
      <main className="main-content">
        <TestDemo />
      </main>
    );
  }

  if (loading) return <div className="loading">Cargando...</div>;
  if (!user) return <Login />;

  const CurrentPage = {
    dashboard: Dashboard,
    tools: Tools,
    categories: Categories,
    shopping: Shopping,
    jobTypes: JobTypes,
    testDemo: TestDemo,
    users: UsersPage
  }[page];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">❄️</div>
          <div>
            <h1>Inventario Venegas Corp</h1>
            <p>Panel de herramientas</p>
          </div>
        </div>

        <nav>
          {menu
            .filter(item => !item.adminOnly || user.role === 'ADMIN')
            .map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.key}
                  className={page === item.key ? 'active' : ''}
                  onClick={() => setPage(item.key)}
                >
                  <Icon size={18} />
                  {item.label}
                </button>
              );
            })}
        </nav>

        <div className="sidebar-footer">
          <div className="user-card">
            <strong>{user.name}</strong>
            <span>{user.role}</span>
          </div>
          <button className="logout" onClick={logout}>
            <LogOut size={18} />
            Salir
          </button>
        </div>
      </aside>

      <main className="main-content">
        <CurrentPage />
      </main>
    </div>
  );
}
