import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@hvac.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    try {
      await login(email, password);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <div className="login-icon">❄️</div>
        <h1>Inventario HVAC</h1>
        <p>Inicia sesión para administrar tus herramientas</p>

        {error && <div className="alert">{error}</div>}

        <label>Correo electrónico</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} />

        <label>Contraseña</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

        <button type="submit">Iniciar sesión</button>

        <small>
          Auto login: si el token sigue activo, la app entra automáticamente.
        </small>
      </form>
    </div>
  );
}
