import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { NavBar } from '../components/NavBar';
import api from '../api';

interface Profile {
  id: string;
  name: string;
  gender: string;
  age: number;
  age_group: string;
  country_name: string;
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

  async function handleExport() {
    try {
      const res = await api.get('/api/profiles/export?format=csv', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'text/csv' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'profiles.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      alert('Export failed. Please try again.');
    }
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
              <tr><th>Name</th><th>Gender</th><th>Age</th><th>Age Group</th><th>Country</th><th></th></tr>
            </thead>
            <tbody>
              {profiles.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.gender}</td>
                  <td>{p.age}</td>
                  <td>{p.age_group}</td>
                  <td>{p.country_name}</td>
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
