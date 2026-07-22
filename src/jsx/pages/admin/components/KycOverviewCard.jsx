import React from "react";
import ReactApexChart from "react-apexcharts";

const KycOverviewCard = ({
  title = "KYC Overview",
  subtitle = "Live distribution of approval states this month.",
  updatedAt = "",
  showUpdatedAt = true,
  className = "",
  loading = false,
  kycSummary = {},
}) => {

  const kycSeries = [
    kycSummary.approved || 0,
    kycSummary.pending || 0,
    kycSummary.rejected || 0,
    kycSummary.submitted || 0,
  ];

  const kycOptions = {
    chart: {
      type: "donut",
      height: 220,
    },
    labels: ["Approved", "Pending", "Rejected", "Submitted"],
    colors: ["#2a6587", "#f59e0b", "#ef4444", "#94a3b8"],
    dataLabels: { enabled: false },
    stroke: { width: 0 },
    legend: { show: false },
    plotOptions: {
      pie: {
        donut: {
          size: "72%",
        },
      },
    },
    tooltip: {
      y: {
        formatter: (value) => value.toLocaleString(),
      },
    },
  };

  const formatCount = (value) =>
    loading ? "..." : Number(value || 0).toLocaleString();

  const showUpdated = showUpdatedAt && updatedAt && updatedAt !== "N/A";

  return (
    <div className={`card nova-panel ${className}`.trim()}>
      <div className="card-body">
        <div className="nova-section-head">
          <div>
            <h4 className="mb-1">{title}</h4>
            <p className="text-muted mb-0">{subtitle}</p>
          </div>

          {showUpdated && (
            <span className="nova-profile-pill">Updated {updatedAt}</span>
          )}
        </div>

        <div className="nova-profile-chart-grid">
          <div className="nova-profile-chart">
            <ReactApexChart
              options={kycOptions}
              series={kycSeries}
              type="donut"
              height={220}
            />
          </div>
          <div className="nova-profile-chart-legend">
            <div className="nova-profile-legend-item">
              <span>
                <i className="nova-legend-dot success" /> Approved
              </span>
              <strong>{formatCount(kycSummary.approved)}</strong>
            </div>

            <div className="nova-profile-legend-item">
              <span>
                <i className="nova-legend-dot warning" /> Pending
              </span>
              <strong>{formatCount(kycSummary.pending)}</strong>
            </div>

            <div className="nova-profile-legend-item">
              <span>
                <i className="nova-legend-dot danger" /> Rejected
              </span>
              <strong>{formatCount(kycSummary.rejected)}</strong>
            </div>

            <div className="nova-profile-legend-item">
              <span>
                <i className="nova-legend-dot neutral" /> Submitted
              </span>
              <strong>{formatCount(kycSummary.submitted)}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KycOverviewCard;
