import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavBar } from '../components/NavBar';
import api from '../api';

export function CreateProfilePage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const res = await api.post('/api/profiles', { name: name.trim() });
      navigate(`/profiles/${res.data.data.id}`);
    } catch (e: any) {
      setError(e.response?.data?.message || 'Failed to create profile');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <NavBar />
      <main className="container">
        <h2>Create Profile</h2>
        <p className="hint">Enter a name — gender, age and country are enriched automatically.</p>
        {error && <p className="error-msg">{error}</p>}
        <form onSubmit={handleSubmit} className="profile-form">
          <label>Full Name *
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Harriet Tubman"
              required
            />
          </label>
          <div className="form-actions">
            <button type="button" onClick={() => navigate(-1)} className="btn-ghost">Cancel</button>
            <button type="submit" disabled={submitting || !name.trim()} className="btn-primary">
              {submitting ? 'Creating…' : 'Create Profile'}
            </button>
          </div>
        </form>
      </main>
    </>
  );
}
