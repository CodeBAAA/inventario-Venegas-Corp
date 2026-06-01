import { useEffect, useState } from 'react';
import { apiFetch } from '../api/client';

export default function UsersPage() {
  const [users, setUsers] = useState([]);

  async function loadUsers() {
    const data = await apiFetch('/users');
    setUsers(data);
  }

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <section>
      <div className="page-header">
        <div>
          <h2>Usuarios</h2>
          <p>Visible solo para administradores</p>
        </div>
      </div>

      <div className="panel table-panel">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
