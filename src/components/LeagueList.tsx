import { LeagueCard } from './LeagueCard';
import type { League, BadgeMap } from '../types';

interface LeagueListProps {
  leagues: League[];
  badges: BadgeMap;
  loadingId: string | null;
  expandedId: string | null;
  onToggle: (id: string) => void;
}

const LeagueList = ({ leagues, badges, loadingId, expandedId, onToggle }: LeagueListProps) => {
  if (leagues.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-icon">🔍</span>
        <p>No leagues match your filters.</p>
      </div>
    );
  }

  return (
    <section className="league-grid" aria-label="Sports leagues list">
      {leagues.map((league) => (
        <LeagueCard
          key={league.idLeague}
          league={league}
          badge={badges[league.idLeague]}
          isLoadingBadge={loadingId === league.idLeague}
          isExpanded={expandedId === league.idLeague}
          onToggle={() => onToggle(league.idLeague)}
        />
      ))}
    </section>
  );
};

export { LeagueList };

