import { useState } from 'react';
import { Link } from 'react-router-dom';
import { NavBar } from '../components/NavBar';
import api from '../api';

interface Profile {
  id: string;
  full_name: string;
  job_title: string;
  country_name: string;
  years_of_experience: number;
}

export function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Profile[]>([]);
  const [meta, setMeta] = useState<{ total: number; page: number; total_pages: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await api.get('/api/profiles/search', { params: { q: query, limit: 20 } });
      setResults(res.data.data);
      setMeta({ total: res.data.total, page: res.data.page, total_pages: res.data.total_pages });
      setSearched(true);
    } catch (e: any) {
      alert(e.response?.data?.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <NavBar />
      <main className="container">
        <h2>Natural Language Search</h2>
        <p className="hint">Try: "engineers in Nigeria with 5+ years" or "top designers in Kenya"</p>
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask about profiles…"
            className="search-input"
          />
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Searching…' : 'Search'}
          </button>
        </form>
        {searched && meta && (
          <p className="result-count">{meta.total} result{meta.total !== 1 ? 's' : ''} found</p>
        )}
        {results.length > 0 && (
          <table className="data-table">
            <thead>
              <tr><th>Name</th><th>Job Title</th><th>Country</th><th>Exp</th><th></th></tr>
            </thead>
            <tbody>
              {results.map((p) => (
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
        {searched && results.length === 0 && !loading && (
          <p className="empty-state">No profiles matched your query.</p>
        )}
      </main>
    </>
  );
}
