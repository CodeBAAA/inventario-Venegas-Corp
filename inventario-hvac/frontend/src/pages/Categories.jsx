import { useEffect, useState } from 'react';
import { apiFetch } from '../api/client';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: '', description: '' });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  async function loadCategories() {
    const data = await apiFetch('/categories');
    setCategories(data);
  }

  useEffect(() => {
    loadCategories();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    try {
      if (editingId) {
        await apiFetch(`/categories/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(form)
        });
      } else {
        await apiFetch('/categories', {
          method: 'POST',
          body: JSON.stringify(form)
        });
      }

      setForm({ name: '', description: '' });
      setEditingId(null);
      await loadCategories();
    } catch (err) {
      setError(err.message);
    }
  }

  function startEdit(category) {
    setEditingId(category.id);
    setForm({
      name: category.name,
      description: category.description || ''
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm({ name: '', description: '' });
    setError('');
  }

  async function deleteCategory(category) {
    const confirmDelete = confirm(
      `¿Seguro que quieres eliminar la categoría "${category.name}"?`
    );

    if (!confirmDelete) return;

    try {
      await apiFetch(`/categories/${category.id}`, {
        method: 'DELETE'
      });

      await loadCategories();
    } catch (err) {
      setError(
        'No se pudo eliminar la categoría. Si tiene herramientas asignadas, primero cambia esas herramientas a otra categoría.'
      );
    }
  }

  return (
    <section>
      <div className="page-header">
        <div>
          <h2>Categorías</h2>
          <p>Organiza herramientas por necesidad o tipo de trabajo</p>
        </div>
      </div>

      <div className="panel">
        <h3>{editingId ? 'Editar categoría' : 'Nueva categoría'}</h3>

        {error && <div className="alert">{error}</div>}

        <form className="form-grid" onSubmit={handleSubmit}>
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

          <button type="submit">
            {editingId ? 'Actualizar' : 'Guardar'}
          </button>

          {editingId && (
            <button type="button" className="secondary-button" onClick={cancelEdit}>
              Cancelar
            </button>
          )}
        </form>
      </div>

      <div className="panel table-panel">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Categoría</th>
              <th>Descripción</th>
              <th>Herramientas</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {categories.map(category => (
              <tr key={category.id}>
                <td>{category.id}</td>
                <td>{category.name}</td>
                <td>{category.description || '-'}</td>
                <td>{category._count?.tools || 0}</td>
                <td className="actions-cell">
                  <button
                    type="button"
                    className="edit-button"
                    onClick={() => startEdit(category)}
                  >
                    Editar
                  </button>

                  <button
                    type="button"
                    className="danger-button"
                    onClick={() => deleteCategory(category)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}