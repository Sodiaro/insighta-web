import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { NavBar } from '../components/NavBar';
import api from '../api';

interface Profile {
  id: string;
  full_name: string;
  job_title: string;
  country_name: string;
  years_of_experience: number;
}

export function ProfilesPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [meta, setMeta] = useState({ page: 1, total: 0, total_pages: 1 });
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = 20;

  useEffect(() => {
    setLoading(true);
    api.get('/api/profiles', { params: { page, limit } })
      .then((r) => {
        setProfiles(r.data.data);
        setMeta({ page: r.data.page, total: r.data.total, total_pages: r.data.total_pages });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page]);

  function handleExport() {
    const url = `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/profiles/export?format=csv`;
    window.open(url, '_blank');
  }

  return (
    <>
      <NavBar />
      <main className="container">
        <div className="page-header">
          <h2>Profiles <span className="count">({meta.total})</span></h2>
          <button onClick={handleExport} className="btn-secondary">Export CSV</button>
        </div>
        {loading ? <p>Loading…</p> : (
          <table className="data-table">
            <thead>
              <tr><th>Name</th><th>Job Title</th><th>Country</th><th>Exp</th><th></th></tr>
            </thead>
            <tbody>
              {profiles.map((p) => (
                <tr key={p.id}>
                  <td>{p.full_name}</td>
                  <td>{p.job_title}</td>
                  <td>{p.country_name}</td>
                  <td>{p.years_of_experience}y</td>
                  <td><Link to={`/profiles/${p.id}`}>View</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div className="pagination">
          <button disabled={page <= 1} onClick={() => setSearchParams({ page: String(page - 1) })}>Prev</button>
          <span>Page {meta.page} of {meta.total_pages}</span>
          <button disabled={page >= meta.total_pages} onClick={() => setSearchParams({ page: String(page + 1) })}>Next</button>
        </div>
      </main>
    </>
  );
}
