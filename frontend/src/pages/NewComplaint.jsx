import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const CATEGORIES = [
  ['pothole', 'Pothole'],
  ['street_light', 'Broken Street Light'],
  ['water_leakage', 'Water Leakage'],
  ['garbage_overflow', 'Garbage Overflow'],
  ['damaged_road', 'Damaged Road'],
  ['other', 'Other'],
];

export default function NewComplaint() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    category: 'pothole', description: '', location: '',
  });
  const [image, setImage] = useState(null);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr(''); setMsg(''); setLoading(true);
    try {
      const fd = new FormData();
      fd.append('category', form.category);
      fd.append('description', form.description);
      fd.append('location', form.location);
      if (image) fd.append('image', image);
      await api.post('/complaints', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMsg('✅ Complaint submitted!');
      setTimeout(() => nav('/dashboard'), 800);
    } catch (e) {
      setErr(e.response?.data?.message || 'Submission failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <div className="card">
        <h2>Report a New Issue</h2>
        {err && <div className="alert alert-error">{err}</div>}
        {msg && <div className="alert alert-ok">{msg}</div>}
        <form onSubmit={submit}>
          <label className="label">Category</label>
          <select className="select" value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}>
            {CATEGORIES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>

          <label className="label">Description</label>
          <textarea className="textarea" placeholder="Describe the issue (mention danger, emergency, school, hospital if relevant)"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })} required />

          <label className="label">Location</label>
          <input className="input" placeholder="e.g. MG Road near City Park, Bengaluru"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })} required />

          <label className="label">Photo (optional)</label>
          <input className="input" type="file" accept="image/*"
            onChange={(e) => setImage(e.target.files[0])} />

          <button className="btn" style={{ marginTop: 16, width: '100%' }} disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Complaint'}
          </button>
        </form>
      </div>
    </div>
  );
}
