import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register, loading } = useAuth();
  const nav = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    if (password.length < 6) return setErr('Password must be 6+ characters');
    try {
      await register(name, email, password);
      nav('/dashboard');
    } catch (e) {
      setErr(e.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: '40px auto' }}>
      <div className="card">
        <h2>Create Account</h2>
        {err && <div className="alert alert-error">{err}</div>}
        <form onSubmit={submit}>
          <label className="label">Full Name</label>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} required />
          <label className="label">Email</label>
          <input className="input" type="email" value={email}
            onChange={(e) => setEmail(e.target.value)} required />
          <label className="label">Password</label>
          <input className="input" type="password" value={password}
            onChange={(e) => setPassword(e.target.value)} required />
          <button className="btn" style={{ marginTop: 16, width: '100%' }} disabled={loading}>
            {loading ? 'Creating...' : 'Register'}
          </button>
        </form>
        <p className="muted" style={{ marginTop: 12 }}>
          Already have one? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
