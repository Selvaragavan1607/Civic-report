import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand">🏙️ CivicReport</Link>
        <div className="nav-links">
          <Link to="/">Home</Link>
          {user && user.role === 'user' && <Link to="/dashboard">My Complaints</Link>}
          {user && user.role === 'user' && <Link to="/new">+ Report</Link>}
          {user && user.role === 'admin' && <Link to="/admin">Admin</Link>}
          {!user && <Link to="/login">Login</Link>}
          {!user && <Link to="/register" className="btn btn-sm">Sign Up</Link>}
          {user && (
            <button className="btn btn-outline btn-sm" onClick={() => { logout(); nav('/'); }}>
              Logout ({user.name})
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
