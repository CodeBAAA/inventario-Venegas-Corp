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
