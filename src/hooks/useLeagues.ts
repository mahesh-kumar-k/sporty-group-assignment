import { useState, useEffect } from 'react';
import type { League } from '../types';

const cache = new Map<string, League[]>();
const LEAGUES_URL = 'https://www.thesportsdb.com/api/v1/json/3/all_leagues.php';

interface UseLeaguesResult {
  leagues: League[];
  loading: boolean;
  error: string | null;
}

const useLeagues = (): UseLeaguesResult => {
  const [leagues, setLeagues] = useState<League[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cache.has(LEAGUES_URL)) {
      setLeagues(cache.get(LEAGUES_URL)!);
      setLoading(false);
      return;
    }

    fetch(LEAGUES_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<{ leagues: League[] }>;
      })
      .then((data) => {
        const list = data.leagues ?? [];
        cache.set(LEAGUES_URL, list);
        setLeagues(list);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Unknown error');
      })
      .finally(() => setLoading(false));
  }, []);

  return { leagues, loading, error };
};

export { useLeagues };

