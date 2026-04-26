import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">Insighta</Link>
      <div className="navbar-links">
        <Link to="/profiles">Profiles</Link>
        <Link to="/search">Search</Link>
        {user?.role === 'admin' && <Link to="/profiles/new">+ New</Link>}
        <button onClick={() => navigate('/account')} className="btn-ghost">{user?.username}</button>
        <button onClick={logout} className="btn-danger-sm">Logout</button>
      </div>
    </nav>
  );
}
