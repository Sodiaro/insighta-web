import { useState } from 'react';
import { Link } from 'react-router-dom';
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
        <p className="hint">Try: "males over 30" or "females in Nigeria" or "adult males"</p>
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
              <tr><th>Name</th><th>Gender</th><th>Age</th><th>Age Group</th><th>Country</th><th></th></tr>
            </thead>
            <tbody>
              {results.map((p) => (
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
        {searched && results.length === 0 && !loading && (
          <p className="empty-state">No profiles matched your query.</p>
        )}
      </main>
    </>
  );
}
