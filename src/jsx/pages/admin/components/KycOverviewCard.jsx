import React from "react";
import ReactApexChart from "react-apexcharts";

// One palette drives the ring and the legend so the colours always agree.
const OUTCOMES = [
  { key: "approved", label: "Approved", color: "#10b981" },
  { key: "pending", label: "Pending", color: "#f59e0b" },
  { key: "rejected", label: "Rejected", color: "#ef4444" },
];

const KycOverviewCard = ({
  title = "KYC Overview",
  subtitle = "Live distribution of approval states this month.",
  updatedAt = "",
  showUpdatedAt = true,
  className = "",
  loading = false,
  kycSummary = {},
}) => {
  // Submitted is the total, not a fourth outcome — including it as a slice
  // double counted every record and made the ring meaningless.
  const counts = OUTCOMES.map(({ key }) => Number(kycSummary[key] || 0));
  const reviewedTotal = counts.reduce((sum, value) => sum + value, 0);
  // The counts payload does not always carry a total, so derive one.
  const submitted = Number(kycSummary.submitted || 0) || reviewedTotal;
  const hasData = reviewedTotal > 0;

  const kycOptions = {
    chart: {
      type: "donut",
      height: 210,
      sparkline: { enabled: false },
    },
    labels: OUTCOMES.map((outcome) => outcome.label),
    colors: OUTCOMES.map((outcome) => outcome.color),
    dataLabels: { enabled: false },
    stroke: { width: 0 },
    legend: { show: false },
    plotOptions: {
      pie: {
        donut: {
          size: "76%",
          labels: {
            show: true,
            value: {
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "#0f172a",
              offsetY: 2,
            },
            total: {
              show: true,
              showAlways: true,
              label: "Submissions",
              color: "#64748b",
              fontSize: "0.72rem",
              formatter: () => submitted.toLocaleString(),
            },
          },
        },
      },
    },
    tooltip: {
      y: { formatter: (value) => value.toLocaleString() },
    },
  };

  // The stat cards own the raw counts, so the legend carries the share.
  const share = (value) =>
    reviewedTotal ? Math.round((value / reviewedTotal) * 100) : 0;

  const showUpdated = showUpdatedAt && updatedAt && updatedAt !== "N/A";

  return (
    <div className={`card nova-panel ${className}`.trim()}>
      <div className="card-body">
        <div className="nova-section-head is-compact">
          <div>
            <h4 className="mb-1">{title}</h4>
            <p className="text-muted mb-0">{subtitle}</p>
          </div>

          {showUpdated && (
            <span className="nova-profile-pill">Updated {updatedAt}</span>
          )}
        </div>

        {!loading && !hasData ? (
          <div className="nova-kyc-overview-empty">
            <i className="pi pi-chart-pie" />
            <h6>No submissions yet</h6>
            <p className="mb-0">
              Outcome shares appear here once applicants submit their KYC.
            </p>
          </div>
        ) : (
          <div className="nova-profile-chart-grid">
            <div className="nova-profile-chart">
              <ReactApexChart
                options={kycOptions}
                series={counts}
                type="donut"
                height={210}
              />
            </div>

            <div className="nova-kyc-legend">
              {OUTCOMES.map((outcome, index) => {
                const percent = share(counts[index]);

                return (
                  <div className="nova-kyc-legend-item" key={outcome.key}>
                    <div className="nova-kyc-legend-head">
                      <span className="nova-kyc-legend-label">
                        <i
                          className="nova-kyc-legend-dot"
                          style={{ background: outcome.color }}
                        />
                        {outcome.label}
                      </span>
                      <strong>{loading ? "..." : `${percent}%`}</strong>
                    </div>

                    <span className="nova-kyc-legend-bar">
                      <span
                        style={{
                          width: `${loading ? 0 : percent}%`,
                          background: outcome.color,
                        }}
                      />
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KycOverviewCard;
