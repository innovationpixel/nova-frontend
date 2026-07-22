import React from "react";

const StatCard = ({ title, value, icon, color = "primary", subtitle }) => {
  return (
    <div className="widget-stat card">
      <div className="card-body p-4">
        <div className="media ai-icon">
          <span className={`me-3 bell icon-bell-effect text-${color} bgl-${color}`}>
            {icon}
          </span>
          <div className="media-body">
            <p className="mb-1 text-uppercase">{title}</p>
            <h4 className="mb-0">{value}</h4>
            {subtitle && <small className="text-muted">{subtitle}</small>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
