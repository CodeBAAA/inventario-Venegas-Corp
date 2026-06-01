import { useEffect, useState } from 'react';
import { apiFetch } from '../api/client';

export default function JobTypes() {
  const [jobTypes, setJobTypes] = useState([]);
  const [tools, setTools] = useState([]);
  const [selectedJobType, setSelectedJobType] = useState(null);

  const [jobForm, setJobForm] = useState({
    name: '',
    description: ''
  });

  const [toolForm, setToolForm] = useState({
    toolId: '',
    quantityNeed: 1,
    note: ''
  });

  async function loadData() {
    const [jobTypesData, toolsData] = await Promise.all([
      apiFetch('/job-types'),
      apiFetch('/tools')
    ]);

    setJobTypes(jobTypesData);
    setTools(toolsData);

    if (selectedJobType) {
      const updated = jobTypesData.find(item => item.id === selectedJobType.id);
      setSelectedJobType(updated || null);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function createJobType(event) {
    event.preventDefault();

    await apiFetch('/job-types', {
      method: 'POST',
      body: JSON.stringify(jobForm)
    });

    setJobForm({
      name: '',
      description: ''
    });

    await loadData();
  }

  async function addTool(event) {
    event.preventDefault();

    if (!selectedJobType) {
      alert('Primero selecciona un tipo de trabajo.');
      return;
    }

    await apiFetch(`/job-types/${selectedJobType.id}/tools`, {
      method: 'POST',
      body: JSON.stringify(toolForm)
    });

    setToolForm({
      toolId: '',
      quantityNeed: 1,
      note: ''
    });

    await loadData();
  }

  async function removeTool(itemId) {
    const confirmDelete = confirm('¿Quitar esta herramienta del tipo de trabajo?');

    if (!confirmDelete) return;

    await apiFetch(`/job-types/tools/${itemId}`, {
      method: 'DELETE'
    });

    await loadData();
  }

  async function deleteJobType(jobTypeId) {
    const confirmDelete = confirm('¿Eliminar este tipo de trabajo completo?');

    if (!confirmDelete) return;

    await apiFetch(`/job-types/${jobTypeId}`, {
      method: 'DELETE'
    });

    setSelectedJobType(null);
    await loadData();
  }

  return (
    <section>
      <div className="page-header">
        <div>
          <h2>Tipos de trabajo</h2>
          <p>Define qué herramientas necesitas llevar según cada servicio</p>
        </div>
      </div>

      <div className="panel">
        <h3>Crear tipo de trabajo</h3>

        <form className="form-grid" onSubmit={createJobType}>
          <input
            placeholder="Ejemplo: Instalación de aire"
            value={jobForm.name}
            onChange={e => setJobForm({ ...jobForm, name: e.target.value })}
          />

          <input
            placeholder="Descripción"
            value={jobForm.description}
            onChange={e => setJobForm({ ...jobForm, description: e.target.value })}
          />

          <button type="submit">Guardar</button>
        </form>
      </div>

      <div className="job-layout">
        <div className="panel">
          <h3>Tipos disponibles</h3>

          <div className="job-list">
            {jobTypes.map(jobType => (
              <button
                key={jobType.id}
                type="button"
                className={
                  selectedJobType?.id === jobType.id
                    ? 'job-card active-job'
                    : 'job-card'
                }
                onClick={() => setSelectedJobType(jobType)}
              >
                <strong>{jobType.name}</strong>
                <span>{jobType.description || 'Sin descripción'}</span>
                <small>{jobType.items.length} herramientas asignadas</small>
              </button>
            ))}
          </div>
        </div>

        <div className="panel">
          {!selectedJobType ? (
            <div className="empty-state">
              <h3>Selecciona un tipo de trabajo</h3>
              <p>
                Aquí verás la lista de herramientas necesarias para ese trabajo.
              </p>
            </div>
          ) : (
            <>
              <div className="panel-header">
                <div>
                  <h3>{selectedJobType.name}</h3>
                  <p>{selectedJobType.description}</p>
                </div>

                <button
                  type="button"
                  className="danger-button"
                  onClick={() => deleteJobType(selectedJobType.id)}
                >
                  Eliminar tipo
                </button>
              </div>

              <form className="form-grid" onSubmit={addTool}>
                <select
                  value={toolForm.toolId}
                  onChange={e => setToolForm({ ...toolForm, toolId: e.target.value })}
                >
                  <option value="">Selecciona herramienta</option>
                  {tools.map(tool => (
                    <option key={tool.id} value={tool.id}>
                      {tool.code} - {tool.name} / Stock: {tool.quantity}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  min="1"
                  placeholder="Cantidad"
                  value={toolForm.quantityNeed}
                  onChange={e =>
                    setToolForm({ ...toolForm, quantityNeed: e.target.value })
                  }
                />

                <input
                  placeholder="Nota opcional"
                  value={toolForm.note}
                  onChange={e => setToolForm({ ...toolForm, note: e.target.value })}
                />

                <button type="submit">Agregar herramienta</button>
              </form>

              <div className="checklist">
                {selectedJobType.items.map(item => {
                  const hasEnough = item.tool.quantity >= item.quantityNeed;

                  return (
                    <div className="checklist-row" key={item.id}>
                      <div>
                        <strong>{item.tool.name}</strong>
                        <p>
                          {item.tool.code} · {item.tool.category?.name} · Ubicación:
                          {' '}
                          {item.tool.location || '-'}
                        </p>
                        {item.note && <small>Nota: {item.note}</small>}
                      </div>

                      <div>
                        <span>Necesitas: {item.quantityNeed}</span>
                        <span>Disponible: {item.tool.quantity}</span>
                      </div>

                      <div>
                        <span className={hasEnough ? 'status-ok' : 'status-bad'}>
                          {hasEnough ? 'Listo' : 'Falta'}
                        </span>
                      </div>

                      <button
                        type="button"
                        className="danger-button"
                        onClick={() => removeTool(item.id)}
                      >
                        Quitar
                      </button>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}