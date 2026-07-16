import { useMemo, useState } from 'react';
import { CheckCircle2, Play, XCircle } from 'lucide-react';
import { calculateInventoryMetrics } from '../utils/inventoryMetrics';

const sampleTools = [
  {
    name: 'Manometro digital',
    quantity: 1,
    minimumQuantity: 2,
    status: 'DISPONIBLE',
    category: { name: 'Medicion' }
  },
  {
    name: 'Bomba de vacio',
    quantity: 3,
    minimumQuantity: 1,
    status: 'DISPONIBLE',
    category: { name: 'Equipos' }
  },
  {
    name: 'Taladro inalambrico',
    quantity: 0,
    minimumQuantity: 1,
    status: 'PERDIDA',
    category: { name: 'Electricas' }
  },
  {
    name: 'Pinza amperimetrica',
    quantity: 1,
    minimumQuantity: 1,
    status: 'DANADA',
    category: { name: 'Medicion' }
  }
];

const expected = {
  totalTools: 4,
  totalCategories: 3,
  totalUsers: 1,
  lowStock: 2,
  available: 2,
  damaged: 1,
  lost: 1,
  byCategory: {
    Medicion: 2,
    Equipos: 3,
    Electricas: 0
  }
};

function areEqual(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

export default function TestDemo() {
  const [hasRun, setHasRun] = useState(false);

  const result = useMemo(() => calculateInventoryMetrics({
    totalTools: 4,
    totalCategories: 3,
    totalUsers: 1,
    tools: sampleTools
  }), []);

  const passed = areEqual(result, expected);

  return (
    <section>
      <div className="page-header">
        <div>
          <h2>Prueba automatica</h2>
          <p>Validacion visual de indicadores del inventario</p>
        </div>
        <button onClick={() => setHasRun(true)}>
          <Play size={18} />
          Ejecutar prueba
        </button>
      </div>

      <div className="panel">
        <h3>Datos de prueba</h3>
        <div className="table-panel">
          <table>
            <thead>
              <tr>
                <th>Herramienta</th>
                <th>Categoria</th>
                <th>Cantidad</th>
                <th>Minimo</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {sampleTools.map(tool => (
                <tr key={tool.name}>
                  <td>{tool.name}</td>
                  <td>{tool.category.name}</td>
                  <td>{tool.quantity}</td>
                  <td>{tool.minimumQuantity}</td>
                  <td>{tool.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {hasRun && (
        <>
          <div className={passed ? 'test-result passed' : 'test-result failed'}>
            {passed ? <CheckCircle2 size={28} /> : <XCircle size={28} />}
            <div>
              <strong>{passed ? 'Prueba aprobada' : 'Prueba fallida'}</strong>
              <span>
                El sistema calculo automaticamente los indicadores esperados.
              </span>
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-card"><span>Total herramientas</span><strong>{result.totalTools}</strong></div>
            <div className="stat-card"><span>Disponibles</span><strong>{result.available}</strong></div>
            <div className="stat-card danger"><span>Bajo stock</span><strong>{result.lowStock}</strong></div>
            <div className="stat-card"><span>Perdidas</span><strong>{result.lost}</strong></div>
          </div>

          <div className="panel">
            <h3>Comparacion esperada vs calculada</h3>
            <div className="table-panel">
              <table>
                <thead>
                  <tr>
                    <th>Indicador</th>
                    <th>Esperado</th>
                    <th>Calculado</th>
                    <th>Resultado</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Total herramientas', expected.totalTools, result.totalTools],
                    ['Disponibles', expected.available, result.available],
                    ['Bajo stock', expected.lowStock, result.lowStock],
                    ['Danadas', expected.damaged, result.damaged],
                    ['Perdidas', expected.lost, result.lost]
                  ].map(([label, expectedValue, resultValue]) => (
                    <tr key={label}>
                      <td>{label}</td>
                      <td>{expectedValue}</td>
                      <td>{resultValue}</td>
                      <td className={expectedValue === resultValue ? 'status-ok' : 'status-bad'}>
                        {expectedValue === resultValue ? 'Correcto' : 'Incorrecto'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
