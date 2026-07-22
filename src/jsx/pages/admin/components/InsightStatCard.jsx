const InsightStatCard = ({ title, value, icon, tone = "primary", hint }) => {
  return (
    <div className={`nova-insight-stat-card is-${tone}`}>
      <div className="nova-insight-stat-icon">{icon}</div>
      <div className="nova-insight-stat-body">
        <span className="nova-insight-stat-label">{title}</span>
        <h3 className="nova-insight-stat-value mb-0">{value}</h3>
        {hint ? <span className="nova-insight-stat-hint">{hint}</span> : null}
      </div>
    </div>
  );
};

export default InsightStatCard;
