import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavBar } from '../components/NavBar';
import api from '../api';

export function CreateProfilePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    full_name: '',
    job_title: '',
    country_name: '',
    years_of_experience: '',
    skills: '',
    bio: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const body: Record<string, any> = {
        full_name: form.full_name,
        job_title: form.job_title,
        country_name: form.country_name,
        years_of_experience: parseInt(form.years_of_experience, 10),
      };
      if (form.skills.trim()) body['skills'] = form.skills.split(',').map((s) => s.trim());
      if (form.bio.trim()) body['bio'] = form.bio.trim();

      const res = await api.post('/api/profiles', body);
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
        {error && <p className="error-msg">{error}</p>}
        <form onSubmit={handleSubmit} className="profile-form">
          <label>Full Name *
            <input name="full_name" value={form.full_name} onChange={handleChange} required />
          </label>
          <label>Job Title *
            <input name="job_title" value={form.job_title} onChange={handleChange} required />
          </label>
          <label>Country *
            <input name="country_name" value={form.country_name} onChange={handleChange} required />
          </label>
          <label>Years of Experience *
            <input name="years_of_experience" type="number" min="0" value={form.years_of_experience} onChange={handleChange} required />
          </label>
          <label>Skills (comma-separated)
            <input name="skills" value={form.skills} onChange={handleChange} placeholder="e.g. TypeScript, React, Node.js" />
          </label>
          <label>Bio
            <textarea name="bio" value={form.bio} onChange={handleChange} rows={3} />
          </label>
          <div className="form-actions">
            <button type="button" onClick={() => navigate(-1)} className="btn-ghost">Cancel</button>
            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? 'Creating…' : 'Create Profile'}
            </button>
          </div>
        </form>
      </main>
    </>
  );
}
