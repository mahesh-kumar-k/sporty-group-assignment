import { useEffect, useState } from 'react';
import type { League } from '../types';

interface LeagueCardProps {
  league: League;
  badge: string | null | undefined;
  isLoadingBadge: boolean;
  isExpanded: boolean;
  onToggle: () => void;
}

const LeagueCard = ({ league, badge, isLoadingBadge, isExpanded, onToggle }: LeagueCardProps) => {
  const { strLeague, strSport, strLeagueAlternate } = league;
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [hasImageError, setHasImageError] = useState(false);

  useEffect(() => {
    setIsImageLoading(Boolean(badge));
    setHasImageError(false);
  }, [badge]);

  const hasBadgeUrl = Boolean(badge);

  return (
    <article
      className={`league-card ${isExpanded ? 'expanded' : ''}`}
      onClick={onToggle}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onToggle()}
      aria-expanded={isExpanded}
    >
      <div className="card-body">
        <h3 className="card-title">{strLeague}</h3>
        {strLeagueAlternate && <p className="card-alternate">{strLeagueAlternate}</p>}
        <span className="card-sport-tag">{strSport}</span>
      </div>

      <div className="card-expand-icon" aria-hidden="true">
        {isExpanded ? '−' : '+'}
      </div>

      {isExpanded && (
        <div className="card-badge-panel" onClick={(e) => e.stopPropagation()}>
          {hasBadgeUrl ? (
            <div className="badge-image-wrapper">
              <img
                src={badge!}
                alt={`${strLeague} season badge`}
                className="badge-image"
                loading="lazy"
                style={{ opacity: isImageLoading ? 0 : 1 }}
                onLoad={() => setIsImageLoading(false)}
                onError={() => {
                  setIsImageLoading(false);
                  setHasImageError(true);
                }}
              />

              {(isLoadingBadge || isImageLoading) && !hasImageError && (
                <div className="badge-loading-overlay">
                  <span className="spinner" />
                </div>
              )}

              {hasImageError && <p className="badge-empty">No badge available for this league.</p>}
            </div>
          ) : isLoadingBadge ? (
            <div className="badge-loading">
              <span className="spinner" />
            </div>
          ) : (
            <p className="badge-empty">No badge available for this league.</p>
          )}
        </div>
      )}
    </article>
  );
};

export { LeagueCard };

