import { useEffect, useState } from 'react';
import { apiFetch, getApiUrl } from '../api/client';

export default function Shopping() {
  const [lists, setLists] = useState([]);
  const [listForm, setListForm] = useState({
    name: 'Compra de herramientas',
    description: ''
  });

  const [itemForm, setItemForm] = useState({
    toolName: '',
    quantityNeeded: 1,
    priority: 'MEDIA',
    description: ''
  });

  async function loadLists() {
    const data = await apiFetch('/shopping-lists');
    setLists(data);
  }

  useEffect(() => {
    loadLists();
  }, []);

  async function createList(event) {
    event.preventDefault();

    await apiFetch('/shopping-lists', {
      method: 'POST',
      body: JSON.stringify(listForm)
    });

    setListForm({
      name: 'Compra de herramientas',
      description: ''
    });

    await loadLists();
  }

  async function addItem(event, listId) {
    event.preventDefault();

    await apiFetch(`/shopping-lists/${listId}/items`, {
      method: 'POST',
      body: JSON.stringify(itemForm)
    });

    setItemForm({
      toolName: '',
      quantityNeeded: 1,
      priority: 'MEDIA',
      description: ''
    });

    await loadLists();
  }

  async function downloadShoppingListPdf(listId) {
    try {
      const token = localStorage.getItem('hvac_token');

      const response = await fetch(
        getApiUrl(`/reports/shopping-list/${listId}/pdf`),
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('No se pudo generar el PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `lista-compras-${listId}.pdf`;

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert('Error al generar el PDF. Verifica que hayas iniciado sesión.');
    }
  }

  return (
    <section>
      <div className="page-header">
        <div>
          <h2>Lista de compras</h2>
          <p>Registra herramientas que necesitas comprar y genera PDF</p>
        </div>
      </div>

      <div className="panel">
        <h3>Crear lista</h3>

        <form className="form-grid" onSubmit={createList}>
          <input
            value={listForm.name}
            onChange={e =>
              setListForm({ ...listForm, name: e.target.value })
            }
          />

          <input
            placeholder="Descripción"
            value={listForm.description}
            onChange={e =>
              setListForm({ ...listForm, description: e.target.value })
            }
          />

          <button type="submit">Crear lista</button>
        </form>
      </div>

      {lists.map(list => (
        <div className="panel" key={list.id}>
          <div className="panel-header">
            <div>
              <h3>{list.name}</h3>
              <p>{list.description}</p>
            </div>

            <button
              type="button"
              onClick={() => downloadShoppingListPdf(list.id)}
            >
              Generar PDF
            </button>
          </div>

          <form className="form-grid" onSubmit={e => addItem(e, list.id)}>
            <input
              placeholder="Herramienta"
              value={itemForm.toolName}
              onChange={e =>
                setItemForm({ ...itemForm, toolName: e.target.value })
              }
            />

            <input
              type="number"
              value={itemForm.quantityNeeded}
              onChange={e =>
                setItemForm({ ...itemForm, quantityNeeded: e.target.value })
              }
            />

            <select
              value={itemForm.priority}
              onChange={e =>
                setItemForm({ ...itemForm, priority: e.target.value })
              }
            >
              <option value="BAJA">Baja</option>
              <option value="MEDIA">Media</option>
              <option value="ALTA">Alta</option>
            </select>

            <input
              placeholder="Nota"
              value={itemForm.description}
              onChange={e =>
                setItemForm({ ...itemForm, description: e.target.value })
              }
            />

            <button type="submit">Agregar</button>
          </form>

          <div className="shopping-items">
            {list.items.map(item => (
              <div className="shopping-item" key={item.id}>
                <strong>{item.toolName}</strong>
                <span>Cantidad: {item.quantityNeeded}</span>
                <span>Prioridad: {item.priority}</span>
                <span>{item.purchased ? 'Comprado' : 'Pendiente'}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}