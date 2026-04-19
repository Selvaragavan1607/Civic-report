import { useEffect, useState } from 'react';
import api from '../api/axios';
import ComplaintCard from '../components/ComplaintCard';

const CATEGORIES = [
  ['', 'All categories'],
  ['pothole', 'Pothole'],
  ['street_light', 'Street Light'],
  ['water_leakage', 'Water Leakage'],
  ['garbage_overflow', 'Garbage Overflow'],
  ['damaged_road', 'Damaged Road'],
  ['other', 'Other'],
];

export default function AdminDashboard() {
  const [list, setList] = useState([]);
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const params = {};
    if (q) params.q = q;
    if (category) params.category = category;
    if (status) params.status = status;
    const { data } = await api.get('/complaints', { params });
    setList(data); setLoading(false);
  };

  useEffect(() => { load(); }, [category, status]);
  const onSearch = (e) => { e.preventDefault(); load(); };

  const updateStatus = async (id, newStatus) => {
    await api.put(`/complaints/${id}/status`, { status: newStatus });
    load();
  };
  const remove = async (id) => {
    if (!confirm('Delete this complaint?')) return;
    await api.delete(`/complaints/${id}`);
    load();
  };

  const stats = {
    total: list.length,
    pending: list.filter(c => c.status === 'Pending').length,
    progress: list.filter(c => c.status === 'In Progress').length,
    resolved: list.filter(c => c.status === 'Resolved').length,
  };

  return (
    <>
      <h2>Admin Dashboard</h2>
      <div className="grid grid-2" style={{ marginBottom: 18 }}>
        <div className="card"><strong>Total</strong><h3>{stats.total}</h3></div>
        <div className="card"><strong>Pending</strong><h3>{stats.pending}</h3></div>
        <div className="card"><strong>In Progress</strong><h3>{stats.progress}</h3></div>
        <div className="card"><strong>Resolved</strong><h3>{stats.resolved}</h3></div>
      </div>

      <form onSubmit={onSearch} className="toolbar">
        <input className="input" placeholder="Search description or location..."
          value={q} onChange={(e) => setQ(e.target.value)} />
        <select className="select" value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATEGORIES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        <select className="select" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          <option>Pending</option>
          <option>In Progress</option>
          <option>Resolved</option>
        </select>
        <button className="btn">Search</button>
      </form>

      {loading && <p>Loading...</p>}
      {!loading && list.length === 0 && <div className="card"><p>No complaints found.</p></div>}

      <div className="grid grid-2">
        {list.map((c) => (
          <ComplaintCard
            key={c._id}
            complaint={c}
            isAdmin
            onStatus={updateStatus}
            onDelete={remove}
          />
        ))}
      </div>
    </>
  );
}
