import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Calendar, SelectPicker } from "rsuite";
import { SVGICON } from "../../../constant/theme";
import { request } from "../../../../utils/api";
import ProjectAreaChart from "../../../elements/dashboard/ProjectAreaChart";
import InviteFriendsStatsCard from "../components/InviteFriendsStatsCard";
import KycOverviewCard from "../components/KycOverviewCard";
import PageTitle from "../../../layouts/PageTitle";
import InsightStatCard from "../components/InsightStatCard";
import CardOfferingsPanel from "../components/CardOfferingsPanel";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [datePreset, setDatePreset] = useState("30");
  const [dateRange, setDateRange] = useState(null);
  const [rangePanelOpen, setRangePanelOpen] = useState(false);
  const rangePanelRef = useRef(null);

  const formatDateParam = useCallback((value) => {
    if (!value) return "";
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }, []);

  const formatRangeLabel = (range) => {
    if (!Array.isArray(range) || !range[0] || !range[1]) return "Custom Range";
    const format = (value) =>
      value.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    return `${format(range[0])} - ${format(range[1])}`;
  };

  const periodOptions = useMemo(
    () => [
      { label: "Today", value: "1" },
      { label: "This Week", value: "7" },
      { label: "Last 12 Days", value: "12" },
      { label: "This Month", value: "30" },
      { label: "Last 90 Days", value: "90" },
      {
        label:
          datePreset === "custom"
            ? formatRangeLabel(dateRange)
            : "Custom Range",
        value: "custom",
      },
    ],
    [datePreset, dateRange],
  );

  const handlePresetChange = (value) => {
    if (!value) {
      setDatePreset("30");
      setDateRange(null);
      setRangePanelOpen(false);
      return;
    }
    setDatePreset(String(value));

    if (value === "custom") {
      setRangePanelOpen(true);
      return;
    }

    setDateRange(null);
    setRangePanelOpen(false);
  };

  const handleRangeChange = (value) => {
    setDateRange(value);
    if (Array.isArray(value) && value[0] && value[1]) {
      setRangePanelOpen(false);
    }
  };

  useEffect(() => {
    if (!rangePanelOpen) return;
    const handleClickOutside = (event) => {
      if (
        rangePanelRef.current &&
        !rangePanelRef.current.contains(event.target)
      ) {
        setRangePanelOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [rangePanelOpen]);

  useEffect(() => {
    const shouldFetchCustom =
      datePreset === "custom" &&
      Array.isArray(dateRange) &&
      dateRange.length === 2 &&
      dateRange[0] &&
      dateRange[1];

    if (datePreset === "custom" && !shouldFetchCustom) return;

    const fetchDashboard = async () => {
      setDashboardLoading(true);
      try {
        const res = await request({
          url: "tevau/dashboard/statistics",
          method: "GET",
          data: {
            ...(datePreset && datePreset !== "custom"
              ? { date_range: datePreset }
              : {}),
            ...(shouldFetchCustom
              ? {
                  start_date: formatDateParam(dateRange[0]),
                  end_date: formatDateParam(dateRange[1]),
                }
              : {}),
          },
        });
        setDashboardData(res.data);
      } catch (error) {
        console.error(error);
        setDashboardData(null);
      } finally {
        setDashboardLoading(false);
      }
    };

    fetchDashboard();
  }, [datePreset, dateRange, formatDateParam]);

  const overview = useMemo(
    () => dashboardData?.overview || {},
    [dashboardData?.overview],
  );
  const statusBreakdown = useMemo(
    () => dashboardData?.status_breakdown || {},
    [dashboardData?.status_breakdown],
  );
  const charts = useMemo(() => dashboardData?.charts || {}, [
    dashboardData?.charts,
  ]);

  const statValue = useCallback(
    (value, suffix = "") =>
      dashboardLoading ? "..." : `${value ?? 0}${suffix}`,
    [dashboardLoading],
  );

  const statCards = useMemo(
    () => [
      {
        label: "Total Users",
        value: statValue(overview.total_users),
        icon: SVGICON.PatientUser,
        tone: "primary",
        hint: "Registered platform users",
      },
      {
        label: "Active Users",
        value: statValue(statusBreakdown.users?.active),
        icon: SVGICON.PatientUser,
        tone: "secondary",
        hint: "Currently active accounts",
      },
      {
        label: "Total KYC",
        value: statValue(overview.total_kyc),
        icon: SVGICON.FormIconSvg,
        tone: "warning",
        hint: "Identity verifications",
      },
      {
        label: "KYC Approval Rate",
        value: statValue(overview.kyc_approval_rate, "%"),
        icon: SVGICON.MessageIcon,
        tone: "success",
        hint: "Approved vs submitted",
      },
      {
        label: "KYC Submitted",
        value: statValue(statusBreakdown.kyc?.submitted),
        icon: SVGICON.CallIcon,
        tone: "warning",
        hint: "Pending review queue",
      },
      {
        label: "KYC Approved",
        value: statValue(statusBreakdown.kyc?.approved),
        icon: SVGICON.SettingIcon,
        tone: "success",
        hint: "Verified applicants",
      },
      {
        label: "Total Sold Cards",
        value: statValue(overview.total_cards),
        icon: SVGICON.BillsSvg,
        tone: "info",
        hint: "Cards sold overall",
      },
      {
        label: "Bound Cards",
        value: statValue(overview.bound_cards),
        icon: SVGICON.ArrowGreen,
        tone: "primary",
        hint: "Linked to users",
      },
      {
        label: "Frozen Cards",
        value: statValue(overview.frozen_cards),
        icon: SVGICON.ArrowRed,
        tone: "danger",
        hint: "Temporarily frozen",
      },
      {
        label: "Cards Pending",
        value: statValue(statusBreakdown.cards?.pending),
        icon: SVGICON.GroupCoin,
        tone: "secondary",
        hint: "Awaiting activation",
      },
      {
        label: "Total Balance",
        value: statValue(overview.total_balance),
        icon: SVGICON.DollerSvg,
        tone: "success",
        hint: "Platform wallet balance",
      },
    ],
    [statValue, overview, statusBreakdown],
  );

  const chartDates = useMemo(() => {
    const dates = new Set();
    (charts.daily_registrations || []).forEach((item) => dates.add(item.date));
    (charts.daily_kyc || []).forEach((item) => dates.add(item.date));
    (charts.daily_cards || []).forEach((item) => dates.add(item.date));
    return Array.from(dates).sort();
  }, [charts]);

  const formatChartLabel = (value) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const mapChartData = useCallback((items) => {
    const map = new Map((items || []).map((item) => [item.date, item.count]));
    return chartDates.map((date) => map.get(date) ?? 0);
  }, [chartDates]);

  const sumChartData = (items) =>
    (items || []).reduce((sum, item) => sum + Number(item.count ?? 0), 0);

  const activityChartSeries = useMemo(
    () => [
      {
        name: "Registrations",
        data: mapChartData(charts.daily_registrations),
      },
      { name: "KYC", data: mapChartData(charts.daily_kyc) },
      { name: "Cards", data: mapChartData(charts.daily_cards) },
    ],
    [charts, mapChartData],
  );

  const activityChartCategories = useMemo(
    () => chartDates.map(formatChartLabel),
    [chartDates],
  );

  const activityTotals = useMemo(
    () => ({
      registrations: sumChartData(charts.daily_registrations),
      kyc: sumChartData(charts.daily_kyc),
      cards: sumChartData(charts.daily_cards),
    }),
    [charts],
  );

  const activityTotalCount =
    activityTotals.registrations + activityTotals.kyc + activityTotals.cards;

  const formatActivityValue = (value) =>
    dashboardLoading ? "..." : Number(value || 0).toLocaleString();

  return (
    <>
      <PageTitle motherMenu="Dashboard" activeMenu="Overview" />

      <div className="nova-page-hero is-dashboard mb-3">
        <div className="nova-page-hero-copy">
          <span className="nova-page-hero-eyebrow">Platform Overview</span>
          <h2 className="nova-page-hero-title mb-2">Nova admin dashboard</h2>
          <p className="nova-page-hero-text mb-0">
            Track users, KYC, cards, referrals, and daily platform activity for
            the selected reporting period.
          </p>
        </div>

        <div className="nova-dashboard-hero-side">
          <div className="nova-page-hero-metrics">
            <div className="nova-page-hero-metric">
              <span>Total Users</span>
              <strong>{formatActivityValue(overview.total_users)}</strong>
            </div>
            <div className="nova-page-hero-metric">
              <span>KYC Approval</span>
              <strong>
                {dashboardLoading
                  ? "..."
                  : `${overview.kyc_approval_rate ?? 0}%`}
              </strong>
            </div>
            <div className="nova-page-hero-metric is-highlight">
              <span>Total Activity</span>
              <strong>{formatActivityValue(activityTotalCount)}</strong>
            </div>
          </div>

          <div
            className="position-relative nova-dashboard-date-filter"
            ref={rangePanelRef}
          >
            <SelectPicker
              className="select-data"
              data={periodOptions}
              value={datePreset}
              onChange={handlePresetChange}
              onSelect={(value) => {
                if (value === "custom") setRangePanelOpen(true);
              }}
              cleanable
              onClean={() => {
                setDatePreset("30");
                setDateRange(null);
                setRangePanelOpen(false);
              }}
              searchable={false}
              placeholder="This Month"
            />

            {rangePanelOpen && datePreset === "custom" && (
              <div className="card shadow-sm mt-2 nova-range-panel nova-dashboard-range-panel">
                <div className="card-body p-2">
                  <Calendar
                    inline
                    selectionMode="range"
                    value={dateRange}
                    onChange={(e) => handleRangeChange(e.value)}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="row g-2 mb-3">
        {statCards.map((stat) => (
          <div className="col-xl-3 col-lg-4 col-md-6" key={stat.label}>
            <InsightStatCard
              title={stat.label}
              value={stat.value}
              icon={stat.icon}
              tone={stat.tone}
              hint={stat.hint}
            />
          </div>
        ))}
      </div>

      <CardOfferingsPanel />

      <div className="row g-2 mb-3 nova-page-insights-row">
        <div className="col-xl-6">
          <KycOverviewCard
            kycSummary={dashboardData?.kyc_counts}
            loading={dashboardLoading}
            showUpdatedAt={false}
            subtitle="Current distribution of KYC statuses."
          />
        </div>
        <div className="col-xl-6">
          <InviteFriendsStatsCard />
        </div>
      </div>

      <div className="card nova-panel mb-3">
        <div className="card-body">
          <div className="nova-section-head is-compact flex-wrap">
            <div>
              <h4 className="mb-1">Daily Activity Trends</h4>
              <p className="text-muted mb-0">
                Registrations, KYC submissions, and card sales over time
              </p>
            </div>

            <div className="nova-dashboard-activity-summary">
              <div className="d-flex justify-content-between gap-3 mb-2">
                <span className="text-muted small">Total Activity</span>
                <strong>{formatActivityValue(activityTotalCount)}</strong>
              </div>
              <div className="progress nova-dashboard-progress">
                <div
                  className="progress-bar bg-primary"
                  style={{
                    width: activityTotalCount
                      ? `${Math.round(
                          (activityTotals.registrations / activityTotalCount) *
                            100,
                        )}%`
                      : "0%",
                  }}
                />
                <div
                  className="progress-bar bg-warning"
                  style={{
                    width: activityTotalCount
                      ? `${Math.round(
                          (activityTotals.kyc / activityTotalCount) * 100,
                        )}%`
                      : "0%",
                  }}
                />
                <div
                  className="progress-bar bg-success"
                  style={{
                    width: activityTotalCount
                      ? `${Math.round(
                          (activityTotals.cards / activityTotalCount) * 100,
                        )}%`
                      : "0%",
                  }}
                />
              </div>
              <div className="d-flex flex-wrap gap-3 mt-2 small text-muted">
                <span>
                  Registrations:{" "}
                  {formatActivityValue(activityTotals.registrations)}
                </span>
                <span>KYC: {formatActivityValue(activityTotals.kyc)}</span>
                <span>Cards: {formatActivityValue(activityTotals.cards)}</span>
              </div>
            </div>
          </div>

          <ProjectAreaChart
            series={activityChartSeries}
            categories={activityChartCategories}
            loading={dashboardLoading}
          />
        </div>
      </div>

      {/* <div className="row g-3">
        <div className="col-xl-7">
          <div className="card nova-panel">
            <div className="card-body">
              <h4 className="mb-3">Latest KYC Submissions</h4>
              <DataTable
                value={kycPreview}
                className="p-datatable-sm nova-table"
              >
                <Column field="id" header="KYC ID" />
                <Column field="name" header="User" />
                <Column field="documentType" header="Document" />
                <Column field="submittedAt" header="Submitted" />
                <Column field="status" header="Status" body={statusTemplate} />
              </DataTable>
            </div>
          </div>
        </div>

        <div className="col-xl-5">
          <div className="card nova-panel">
            <div className="card-body">
              <h4 className="mb-3">Today Transactions</h4>
              <DataTable
                value={txnPreview}
                className="p-datatable-sm nova-table"
              >
                <Column field="id" header="Txn ID" />
                <Column field="user" header="User" />
                <Column field="amount" header="Amount" />
                <Column field="status" header="Status" body={statusTemplate} />
              </DataTable>
            </div>
          </div>
        </div>
      </div> */}
    </>
  );
};

export default Dashboard;
