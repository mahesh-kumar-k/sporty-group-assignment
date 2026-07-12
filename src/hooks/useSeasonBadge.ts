import { useState, useCallback } from 'react';
import type { BadgeMap } from '../types';

const cache = new Map<string, string | null>();

interface UseSeasonBadgeResult {
  badges: BadgeMap;
  loadingId: string | null;
  fetchBadge: (leagueId: string) => Promise<void>;
}

interface SeasonEntry {
  strBadge?: string;
}

interface SeasonsResponse {
  seasons?: SeasonEntry[];
}

const useSeasonBadge = (): UseSeasonBadgeResult => {
  const [badges, setBadges] = useState<BadgeMap>({});
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const fetchBadge = useCallback(
    async (leagueId: string): Promise<void> => {
      if (leagueId in badges) return; // already fetched (even if null)
      if (cache.has(leagueId)) {
        setBadges((prev) => ({ ...prev, [leagueId]: cache.get(leagueId) }));
        return;
      }

      setLoadingId(leagueId);
      try {
        const url = `https://www.thesportsdb.com/api/v1/json/3/search_all_seasons.php?badge=1&id=${leagueId}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as SeasonsResponse;
        const badgeUrl = data.seasons?.[0]?.strBadge ?? null;
        cache.set(leagueId, badgeUrl);
        setBadges((prev) => ({ ...prev, [leagueId]: badgeUrl }));
      } catch {
        cache.set(leagueId, null);
        setBadges((prev) => ({ ...prev, [leagueId]: null }));
      } finally {
        setLoadingId(null);
      }
    },
    [badges],
  );

  return { badges, loadingId, fetchBadge };
};

export { useSeasonBadge };

