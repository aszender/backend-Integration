import React, { useEffect, useState } from 'react';

interface User {
  _id: string;
  name: string;
  email: string;
}

const API_URL = '/api/users';
const AUTH_URL = '/api/auth';

const HomePage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? window.localStorage.getItem('authToken') : null;
    if (saved) setToken(saved);
  }, []);

  const authHeaders = (extra?: Record<string, string>) => {
    const headers: Record<string, string> = { ...(extra || {}) };
    if (token) headers.Authorization = `Bearer ${token}`;
    return headers;
  };

  const fetchUsers = async () => {
    setApiError(null);
    const res = await fetch(API_URL, { headers: authHeaders() });
    if (!res.ok) {
      const text = await res.text();
      setUsers([]);
      setApiError(text || `Request failed (${res.status})`);
      return;
    }
    const data = await res.json();
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    // Re-fetch when auth state changes (helps when ENFORCE_AUTH=true)
    fetchUsers();
  }, [token]);

  const saveToken = (newToken: string) => {
    setToken(newToken);
    window.localStorage.setItem('authToken', newToken);
  };

  const clearToken = () => {
    setToken(null);
    window.localStorage.removeItem('authToken');
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const res = await fetch(`${AUTH_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: authName, email: authEmail, password: authPassword }),
    });
    if (!res.ok) {
      const text = await res.text();
      setAuthError(text || `Register failed (${res.status})`);
      return;
    }
    const data = await res.json();
    if (data?.token) saveToken(data.token);
    setAuthPassword('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const res = await fetch(`${AUTH_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: authEmail, password: authPassword }),
    });
    if (!res.ok) {
      const text = await res.text();
      setAuthError(text || `Login failed (${res.status})`);
      return;
    }
    const data = await res.json();
    if (data?.token) saveToken(data.token);
    setAuthPassword('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await fetch(`${API_URL}/${editingId}`, {
        method: 'PUT',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ name, email }),
      });
    } else {
      await fetch(API_URL, {
        method: 'POST',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ name, email }),
      });
    }
    setName('');
    setEmail('');
    setEditingId(null);
    fetchUsers();
  };

  const handleEdit = (user: User) => {
    setEditingId(user._id);
    setName(user.name);
    setEmail(user.email);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    await fetch(`${API_URL}/${id}`, { method: 'DELETE', headers: authHeaders() });
    fetchUsers();
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 20, fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#2a7ae2' }}>User Management</h1>

      <div style={{ marginBottom: 20, padding: 12, border: '1px solid #ddd', borderRadius: 6 }}>
        <h2 style={{ marginTop: 0 }}>Auth</h2>
        {token ? (
          <div>
            <div style={{ marginBottom: 8 }}>
              <strong>Status:</strong> Authenticated
            </div>
            <button onClick={clearToken}>
              Logout
            </button>
          </div>
        ) : (
          <form style={{ display: 'grid', gap: 8 }}>
            <div>
              <label>Name (register only):</label>
              <input
                type="text"
                value={authName}
                onChange={e => setAuthName(e.target.value)}
                style={{ width: '100%', padding: 8, border: '1px solid #ccc', borderRadius: 4 }}
              />
            </div>
            <div>
              <label>Email:</label>
              <input
                type="email"
                value={authEmail}
                onChange={e => setAuthEmail(e.target.value)}
                required
                style={{ width: '100%', padding: 8, border: '1px solid #ccc', borderRadius: 4 }}
              />
            </div>
            <div>
              <label>Password:</label>
              <input
                type="password"
                value={authPassword}
                onChange={e => setAuthPassword(e.target.value)}
                required
                minLength={8}
                style={{ width: '100%', padding: 8, border: '1px solid #ccc', borderRadius: 4 }}
              />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={handleRegister} type="button">
                Register
              </button>
              <button onClick={handleLogin} type="button">
                Login
              </button>
            </div>
            {authError ? <div style={{ color: 'crimson' }}>{authError}</div> : null}
          </form>
        )}
      </div>

      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input type="hidden" value={editingId || ''} />
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          style={{ width: '100%', padding: 8, marginBottom: 8, border: '1px solid #ccc', borderRadius: 4 }}
        />
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{ width: '100%', padding: 8, marginBottom: 8, border: '1px solid #ccc', borderRadius: 4 }}
        />
        <button type="submit" style={{ padding: '8px 16px', backgroundColor: '#2a7ae2', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
          {editingId ? 'Update User' : 'Save User'}
        </button>
      </form>

      {apiError ? (
        <div style={{ marginBottom: 12, color: 'crimson' }}>
          {apiError}
        </div>
      ) : null}

      <h2>Users</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>{user._id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <button onClick={() => handleEdit(user)} style={{ marginRight: 6 }}>Edit</button>
                <button onClick={() => handleDelete(user._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HomePage;