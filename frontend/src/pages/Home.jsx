import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();
  return (
    <>
      <section className="hero">
        <h1>Report Public Issues. Build Better Cities.</h1>
        <p>Potholes, broken lights, water leaks, garbage — report them in seconds. Stored securely in the cloud.</p>
        {!user && <Link to="/register" className="btn">Get Started — It's Free</Link>}
        {user && user.role === 'user' && <Link to="/new" className="btn">+ Report an Issue</Link>}
        {user && user.role === 'admin' && <Link to="/admin" className="btn">Open Admin Dashboard</Link>}
      </section>

      <div className="grid grid-2">
        <div className="card">
          <h3>📸 Easy Reporting</h3>
          <p>Snap a photo, pick a category, drop your location. Done.</p>
        </div>
        <div className="card">
          <h3>☁️ Cloud-Powered</h3>
          <p>Complaints stored on MongoDB Atlas — accessible from anywhere, anytime.</p>
        </div>
        <div className="card">
          <h3>⚡ Auto-Prioritization</h3>
          <p>Dangerous and high-impact issues are surfaced first to administrators automatically.</p>
        </div>
        <div className="card">
          <h3>🛠️ Track Progress</h3>
          <p>See your complaint move from Pending → In Progress → Resolved.</p>
        </div>
      </div>
    </>
  );
}
