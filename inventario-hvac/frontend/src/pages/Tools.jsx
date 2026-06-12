import { useEffect, useState } from 'react';
import { apiFetch } from '../api/client';
import QRModal from '../components/QRModal';

const emptyForm = {
  name: '',
  description: '',
  brand: '',
  model: '',
  serialNumber: '',
  quantity: 1,
  minimumQuantity: 1,
  unit: 'unidad',
  location: '',
  status: 'DISPONIBLE',
  categoryId: ''
};

export default function Tools() {
  const [tools, setTools] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    categoryId: '',
    status: ''
  });
  const [selectedToolQR, setSelectedToolQR] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  async function loadData() {
    const params = new URLSearchParams();

    if (filters.search) params.append('search', filters.search);
    if (filters.categoryId) params.append('categoryId', filters.categoryId);
    if (filters.status) params.append('status', filters.status);

    const [toolsData, categoriesData] = await Promise.all([
      apiFetch(`/tools?${params.toString()}`),
      apiFetch('/categories')
    ]);

    setTools(toolsData);
    setCategories(categoriesData);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function applyFilters() {
    await loadData();
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    try {
      if (editingId) {
        await apiFetch(`/tools/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(form)
        });
      } else {
        await apiFetch('/tools', {
          method: 'POST',
          body: JSON.stringify(form)
        });
      }

      setForm(emptyForm);
      setEditingId(null);
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  function startEdit(tool) {
    setEditingId(tool.id);

    setForm({
      name: tool.name || '',
      description: tool.description || '',
      brand: tool.brand || '',
      model: tool.model || '',
      serialNumber: tool.serialNumber || '',
      quantity: tool.quantity || 1,
      minimumQuantity: tool.minimumQuantity || 1,
      unit: tool.unit || 'unidad',
      location: tool.location || '',
      status: tool.status || 'DISPONIBLE',
      categoryId: tool.categoryId || ''
    });

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
    setError('');
  }

  async function removeTool(id) {
    const confirmDelete = confirm('¿Eliminar esta herramienta?');

    if (!confirmDelete) return;

    await apiFetch(`/tools/${id}`, {
      method: 'DELETE'
    });

    await loadData();
  }

  return (
    <section>
      <div className="page-header">
        <div>
          <h2>Herramientas</h2>
          <p>Inventario completo con filtros y control de stock</p>
        </div>
      </div>

      <div className="panel">
        <h3>{editingId ? 'Editar herramienta' : 'Agregar herramienta'}</h3>

        {error && <div className="alert">{error}</div>}

        <form className="form-grid tools-form" onSubmit={handleSubmit}>
          <input
            placeholder="Nombre"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />

          <input
            placeholder="Descripción"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
          />

          <input
            placeholder="Marca"
            value={form.brand}
            onChange={e => setForm({ ...form, brand: e.target.value })}
          />

          <input
            placeholder="Modelo"
            value={form.model}
            onChange={e => setForm({ ...form, model: e.target.value })}
          />

          <input
            placeholder="Número de serie"
            value={form.serialNumber}
            onChange={e => setForm({ ...form, serialNumber: e.target.value })}
          />

          <input
            type="number"
            min="0"
            placeholder="Cantidad"
            value={form.quantity}
            onChange={e => setForm({ ...form, quantity: e.target.value })}
          />

          <input
            type="number"
            min="0"
            placeholder="Cantidad mínima"
            value={form.minimumQuantity}
            onChange={e => setForm({ ...form, minimumQuantity: e.target.value })}
          />

          <input
            placeholder="Unidad"
            value={form.unit}
            onChange={e => setForm({ ...form, unit: e.target.value })}
          />

          <input
            placeholder="Ubicación"
            value={form.location}
            onChange={e => setForm({ ...form, location: e.target.value })}
          />

          <select
            value={form.categoryId}
            onChange={e => setForm({ ...form, categoryId: e.target.value })}
          >
            <option value="">Categoría</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <select
            value={form.status}
            onChange={e => setForm({ ...form, status: e.target.value })}
          >
            <option value="DISPONIBLE">Disponible</option>
            <option value="EN_USO">En uso</option>
            <option value="DANADA">Dañada</option>
            <option value="PERDIDA">Perdida</option>
            <option value="POR_COMPRAR">Por comprar</option>
          </select>

          <button type="submit">
            {editingId ? 'Actualizar' : 'Guardar'}
          </button>

          {editingId && (
            <button
              type="button"
              className="secondary-button"
              onClick={cancelEdit}
            >
              Cancelar
            </button>
          )}
        </form>
      </div>

      <div className="filters">
        <input
          placeholder="Buscar herramienta..."
          value={filters.search}
          onChange={e => setFilters({ ...filters, search: e.target.value })}
        />

        <select
          value={filters.categoryId}
          onChange={e => setFilters({ ...filters, categoryId: e.target.value })}
        >
          <option value="">Todas las categorías</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <select
          value={filters.status}
          onChange={e => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="">Todos los estados</option>
          <option value="DISPONIBLE">Disponible</option>
          <option value="EN_USO">En uso</option>
          <option value="DANADA">Dañada</option>
          <option value="PERDIDA">Perdida</option>
          <option value="POR_COMPRAR">Por comprar</option>
        </select>

        <button type="button" onClick={applyFilters}>
          Filtrar
        </button>
      </div>

      <div className="panel table-panel">
        <table>
          <thead>
            <tr>
              <th>ID único</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Marca</th>
              <th>Modelo</th>
              <th>Cantidad</th>
              <th>Mínimo</th>
              <th>Ubicación</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {tools.map(tool => (
              <tr key={tool.id}>
                <td>{tool.code}</td>
                <td>{tool.name}</td>
                <td>{tool.category?.name}</td>
                <td>{tool.brand || '-'}</td>
                <td>{tool.model || '-'}</td>
                <td className={tool.quantity < tool.minimumQuantity ? 'text-danger' : ''}>
                  {tool.quantity}
                </td>
                <td>{tool.minimumQuantity}</td>
                <td>{tool.location || '-'}</td>
                <td>{tool.status}</td>
                <td className="actions-cell">
                  <button
                    type="button"
                    className="edit-button"
                    onClick={() => startEdit(tool)}
                  >
                    Editar
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedToolQR(tool)}
                  >
                    Ver QR
                  </button>

                  <button
                    type="button"
                    className="danger-button"
                    onClick={() => removeTool(tool.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <QRModal
        tool={selectedToolQR}
        onClose={() => setSelectedToolQR(null)}
      />
    </section>
  );
}