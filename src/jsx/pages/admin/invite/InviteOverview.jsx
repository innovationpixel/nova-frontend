import { useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import Loading from "../../../components/utilComponents/Loading";

const InviteOverview = ({ stats, loading }) => {
  const levelStats = useMemo(() => {
    if (!stats?.by_level) return [];

    return Object.entries(stats.by_level)
      .map(([level, item]) => ({
        level,
        invites: Number(item?.total_referral_invites ?? 0),
        payout: Number(item?.total_rewarded_usd ?? 0),
      }))
      .sort((a, b) => Number(a.level) - Number(b.level));
  }, [stats]);

  const totalInvites = Number(stats?.total_referral_invites ?? 0);
  const totalPayout = Number(stats?.total_rewarded_usd ?? 0);

  const chartOptions = useMemo(
    () => ({
      chart: {
        type: "donut",
        height: 220,
      },
      labels: levelStats.map((item) => `Level ${item.level}`),
      colors: ["#2a6587", "#2696fd", "#ffab2d", "#10b981"],
      dataLabels: { enabled: false },
      stroke: { width: 0 },
      legend: {
        show: true,
        position: "bottom",
        fontSize: "12px",
      },
      plotOptions: {
        pie: {
          donut: {
            size: "72%",
            labels: {
              show: true,
              total: {
                show: true,
                label: "Invites",
                formatter: () => totalInvites.toLocaleString(),
              },
            },
          },
        },
      },
      tooltip: {
        y: {
          formatter: (value) => `${Number(value || 0).toLocaleString()} invites`,
        },
      },
    }),
    [levelStats, totalInvites],
  );

  const chartSeries = useMemo(
    () => levelStats.map((item) => item.invites),
    [levelStats],
  );

  if (loading) {
    return (
      <div className="card nova-panel">
        <div className="card-body d-flex align-items-center justify-content-center py-4">
          <Loading />
        </div>
      </div>
    );
  }

  return (
    <div className="card nova-panel">
      <div className="card-body">
        <div className="nova-section-head is-compact">
          <div>
            <h4 className="mb-1">Referral Performance</h4>
            <p className="text-muted mb-0">
              Level distribution, invite share, and payout contribution.
            </p>
          </div>
          <span className="nova-profile-pill">
            ${totalPayout.toLocaleString()} paid out
          </span>
        </div>

        <div className="nova-invite-chart-layout">
          <div className="nova-invite-chart-panel">
            {levelStats.length ? (
              <ReactApexChart
                options={chartOptions}
                series={chartSeries}
                type="donut"
                height={220}
              />
            ) : (
              <div className="nova-invite-empty-state compact">
                <i className="pi pi-chart-pie" />
                <p>No referral level data yet.</p>
              </div>
            )}
          </div>

          <div className="nova-invite-level-stack">
            {levelStats.length ? (
              levelStats.map((item) => {
                const inviteShare = totalInvites
                  ? Math.round((item.invites / totalInvites) * 100)
                  : 0;
                const payoutShare = totalPayout
                  ? Math.round((item.payout / totalPayout) * 100)
                  : 0;

                return (
                  <div className="nova-invite-level-card" key={item.level}>
                    <div className="d-flex align-items-center justify-content-between gap-2 mb-2">
                      <div>
                        <strong>Level {item.level}</strong>
                        <div className="text-muted small">
                          {inviteShare}% of invite volume
                        </div>
                      </div>
                      <span className="nova-invite-level-pill">
                        {item.invites.toLocaleString()}
                      </span>
                    </div>

                    <div className="nova-invite-progress mb-2">
                      <div
                        className="nova-invite-progress-bar"
                        style={{ width: `${inviteShare}%` }}
                      />
                    </div>

                    <div className="d-flex justify-content-between small">
                      <span className="text-muted">Payout</span>
                      <strong>
                        ${item.payout.toLocaleString()} ({payoutShare}%)
                      </strong>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="nova-invite-empty-state compact">
                <i className="pi pi-users" />
                <p>Level stats will appear once referrals start coming in.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InviteOverview;
