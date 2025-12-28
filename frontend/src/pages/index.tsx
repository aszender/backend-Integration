import React, { useEffect, useState } from 'react';

interface User {
  _id: string;
  name: string;
  email: string;
}

const API_URL = '/api/users';

const HomePage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchUsers = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await fetch(`${API_URL}/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      });
    } else {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    fetchUsers();
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 20, fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#2a7ae2' }}>User Management</h1>
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