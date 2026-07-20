const API_URL = import.meta.env.VITE_API_URL || 'https://y13q1na66e.execute-api.us-west-2.amazonaws.com/api';

function getToken() {
  return localStorage.getItem('hvac_token');
}

export async function apiFetch(path, options = {}) {
  const token = getToken();

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error desconocido' }));
    throw new Error(error.message || 'Error en la solicitud');
  }

  return response.json();
}

export function getApiUrl(path) {
  return `${API_URL}${path}`;
}

export async function downloadApiFile(path, filename) {
  const token = getToken();
  const response = await fetch(`${API_URL}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'No se pudo descargar el archivo' }));
    throw new Error(error.message || 'No se pudo descargar el archivo');
  }

  const blob = await response.blob();

  if (!blob.size) {
    throw new Error('El servidor devolvió un archivo vacío');
  }

  if (!blob.type.includes('application/pdf')) {
    throw new Error(`El servidor devolvió un archivo inesperado (${blob.type || 'sin tipo'})`);
  }

  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  link.remove();

  // Safari puede cancelar la descarga si la URL se revoca en el mismo ciclo
  // del click. Se conserva el tiempo suficiente para que el navegador lea el PDF.
  window.setTimeout(() => window.URL.revokeObjectURL(url), 60_000);
}
