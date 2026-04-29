import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { NavBar } from '../components/NavBar';
import { useAuth } from '../context/AuthContext';
import api from '../api';

interface Profile {
  id: string;
  name: string;
  gender: string;
  gender_probability: number;
  age: number;
  age_group: string;
  country_id: string;
  country_name: string;
  country_probability: number;
  created_at: string;
}

export function ProfileDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    api.get(`/api/profiles/${id}`)
      .then((r) => setProfile(r.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  async function handleDelete() {
    if (!confirm('Delete this profile?')) return;
    setDeleting(true);
    try {
      await api.delete(`/api/profiles/${id}`);
      navigate('/profiles');
    } catch (e: any) {
      alert(e.response?.data?.message || 'Delete failed');
    } finally {
      setDeleting(false);
    }
  }

  if (loading) return <><NavBar /><main className="container"><p>Loading…</p></main></>;
  if (!profile) return <><NavBar /><main className="container"><p>Profile not found.</p></main></>;

  return (
    <>
      <NavBar />
      <main className="container">
        <button onClick={() => navigate(-1)} className="btn-ghost back-btn">← Back</button>
        <div className="profile-card">
          <h2>{profile.name}</h2>
          <p className="job-title">{profile.gender} · {profile.age_group}</p>
          <dl className="detail-list">
            <dt>Gender</dt><dd>{profile.gender} ({(profile.gender_probability * 100).toFixed(1)}%)</dd>
            <dt>Age</dt><dd>{profile.age}</dd>
            <dt>Age Group</dt><dd>{profile.age_group}</dd>
            <dt>Country</dt><dd>{profile.country_name} ({profile.country_id})</dd>
            <dt>Country Probability</dt><dd>{(profile.country_probability * 100).toFixed(1)}%</dd>
            <dt>Created</dt><dd>{new Date(profile.created_at).toLocaleDateString()}</dd>
          </dl>
          {user?.role === 'admin' && (
            <button onClick={handleDelete} disabled={deleting} className="btn-danger">
              {deleting ? 'Deleting…' : 'Delete Profile'}
            </button>
          )}
        </div>
      </main>
    </>
  );
}
