interface SportFilterProps {
  sports: string[];
  value: string;
  onChange: (value: string) => void;
}

const SportFilter = ({ sports, value, onChange }: SportFilterProps) => {
  return (
    <div className="sport-filter">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="sport-select"
        aria-label="Filter by sport"
      >
        <option value="">All Sports</option>
        {sports.map((sport) => (
          <option key={sport} value={sport}>
            {sport}
          </option>
        ))}
      </select>
      <svg className="select-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </div>
  );
};

export { SportFilter };

