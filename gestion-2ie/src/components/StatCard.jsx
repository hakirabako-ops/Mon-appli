import './StatCard.css';

export default function StatCard({ title, value, icon, color = 'blue', trend = null }) {
  return (
    <div className={`stat-card stat-card-${color}`}>
      {icon && <div className="stat-icon">{icon}</div>}
      <div className="stat-content">
        <p className="stat-title">{title}</p>
        <p className="stat-value">{value}</p>
        {trend && <p className={`stat-trend ${trend > 0 ? 'positive' : 'negative'}`}>
          {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
        </p>}
      </div>
    </div>
  );
}
