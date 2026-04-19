import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login, loading } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      const u = await login(email, password);
      nav(u.role === 'admin' ? '/admin' : '/dashboard');
    } catch (e) {
      setErr(e.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: '40px auto' }}>
      <div className="card">
        <h2>Login</h2>
        {err && <div className="alert alert-error">{err}</div>}
        <form onSubmit={submit}>
          <label className="label">Email</label>
          <input className="input" type="email" value={email}
            onChange={(e) => setEmail(e.target.value)} required />
          <label className="label">Password</label>
          <input className="input" type="password" value={password}
            onChange={(e) => setPassword(e.target.value)} required />
          <button className="btn" style={{ marginTop: 16, width: '100%' }} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="muted" style={{ marginTop: 12 }}>
          No account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
}
