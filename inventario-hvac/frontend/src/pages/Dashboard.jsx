import { useEffect, useState } from 'react';
import { apiFetch, getApiUrl } from '../api/client';

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  async function loadStats() {
    const data = await apiFetch('/reports/dashboard');
    setStats(data);
  }

  useEffect(() => {
    loadStats();
  }, []);

  if (!stats) return <div>Cargando dashboard...</div>;

  return (
    <section>
      <div className="page-header">
        <div>
          <h2>Dashboard</h2>
          <p>Resumen general del inventario</p>
        </div>
        <a className="primary-link" href={getApiUrl('/reports/inventory/pdf')} target="_blank">
          Descargar inventario PDF
        </a>
      </div>

      <div className="stats-grid">
        <div className="stat-card"><span>Total herramientas</span><strong>{stats.totalTools}</strong></div>
        <div className="stat-card"><span>Categorías</span><strong>{stats.totalCategories}</strong></div>
        <div className="stat-card"><span>Disponibles</span><strong>{stats.available}</strong></div>
        <div className="stat-card danger"><span>Bajo stock</span><strong>{stats.lowStock}</strong></div>
      </div>

      <div className="panel">
        <h3>Herramientas por categoría</h3>
        <div className="category-list">
          {Object.entries(stats.byCategory).map(([name, total]) => (
            <div key={name} className="category-row">
              <span>{name}</span>
              <strong>{total}</strong>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
