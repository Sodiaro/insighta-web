import { NavBar } from '../components/NavBar';
import { useAuth } from '../context/AuthContext';

export function AccountPage() {
  const { user, logout } = useAuth();

  return (
    <>
      <NavBar />
      <main className="container">
        <h2>Account</h2>
        {user?.avatar_url && (
          <img src={user.avatar_url} alt="avatar" className="avatar" />
        )}
        <dl className="detail-list">
          <dt>Username</dt><dd>@{user?.username}</dd>
          <dt>Email</dt><dd>{user?.email || '—'}</dd>
          <dt>Role</dt><dd className="role-badge">{user?.role}</dd>
          <dt>Status</dt><dd>{user?.is_active ? 'Active' : 'Inactive'}</dd>
        </dl>
        <button onClick={logout} className="btn-danger">Sign Out</button>
      </main>
    </>
  );
}
