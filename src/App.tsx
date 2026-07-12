import { useState, useMemo } from 'react';
import { useLeagues } from './hooks/useLeagues';
import { useSeasonBadge } from './hooks/useSeasonBadge';
import { SearchBar } from './components/SearchBar';
import { SportFilter } from './components/SportFilter';
import { LeagueList } from './components/LeagueList';
import sportyLogo from './assets/sportylogo.png';

export default function App() {
  const { leagues, loading, error } = useLeagues();
  const { badges, loadingId, fetchBadge } = useSeasonBadge();

  const [search, setSearch] = useState<string>('');
  const [sportFilter, setSportFilter] = useState<string>('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Derive unique sorted sport options
  const sports = useMemo<string[]>(
    () => [...new Set(leagues.map((l) => l.strSport))].sort(),
    [leagues],
  );

  // Filter leagues by search term and sport dropdown
  const filteredLeagues = useMemo(
    () => {
      const q = search.trim().toLowerCase();
      return leagues.filter((l) => {
        const matchesSearch =
          !q ||
          l.strLeague?.toLowerCase().includes(q) ||
          l.strLeagueAlternate?.toLowerCase().includes(q);
        const matchesSport = !sportFilter || l.strSport === sportFilter;
        return matchesSearch && matchesSport;
      });
    },
    [leagues, search, sportFilter],
  );

  function handleToggle(id: string): void {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
      void fetchBadge(id);
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <img
            src={sportyLogo}
            alt="Sporty Group"
            className="header-logo-img"
          />
          <div>
            <h1 className="header-title">Sports Leagues</h1>
            <p className="header-subtitle">Browse &amp; explore sports leagues worldwide</p>
          </div>
        </div>
      </header>

      <div className="controls-bar">
        <div className="controls-inner">
          <SearchBar value={search} onChange={setSearch} />
          <SportFilter sports={sports} value={sportFilter} onChange={setSportFilter} />
          <span className="results-count">
            {loading ? '' : `${filteredLeagues.length} league${filteredLeagues.length !== 1 ? 's' : ''}`}
          </span>
        </div>
      </div>

      <main className="app-main">
        {loading && (
          <div className="loading-state">
            <span className="spinner large" />
            <p>Fetching leagues…</p>
          </div>
        )}
        {error && (
          <div className="error-state">
            <span>⚠️</span>
            <p>Failed to load leagues: {error}</p>
          </div>
        )}
        {!loading && !error && (
          <LeagueList
            leagues={filteredLeagues}
            badges={badges}
            loadingId={loadingId}
            expandedId={expandedId}
            onToggle={handleToggle}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>
          Data provided by{' '}
          <a href="https://www.thesportsdb.com" target="_blank" rel="noreferrer">
            TheSportsDB
          </a>
        </p>
      </footer>
    </div>
  );
}
