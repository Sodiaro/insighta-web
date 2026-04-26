import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { NavBar } from '../components/NavBar';
import api from '../api';

export function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<{ total: number } | null>(null);

  useEffect(() => {
    api.get('/api/profiles?limit=1').then((r) => setStats({ total: r.data.total })).catch(() => {});
  }, []);

  return (
    <>
      <NavBar />
      <main className="container">
        <h2>Welcome, {user?.username}</h2>
        <p className="role-badge">{user?.role}</p>
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-value">{stats?.total ?? '—'}</span>
            <span className="stat-label">Total Profiles</span>
          </div>
        </div>
        <div className="quick-links">
          <Link to="/profiles" className="btn-primary">Browse Profiles</Link>
          <Link to="/search" className="btn-secondary">Natural Language Search</Link>
          {user?.role === 'admin' && <Link to="/profiles/new" className="btn-success">Create Profile</Link>}
        </div>
      </main>
    </>
  );
}
