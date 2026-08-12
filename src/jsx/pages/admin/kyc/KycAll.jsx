import { useMemo, useState } from "react";
import { SVGICON } from "../../../constant/theme";
import PageTitle from "../../../layouts/PageTitle";
import InsightStatCard from "../components/InsightStatCard";
import KycOverviewCard from "../components/KycOverviewCard";
import KycTable from "../components/KycTable";

const statCards = [
  {
    key: "total",
    title: "KYC Submitted",
    icon: SVGICON.FormIconSvg,
    tone: "primary",
    hint: "All submissions received",
  },
  {
    key: "pending",
    title: "KYC Pending",
    icon: SVGICON.CallIcon,
    tone: "warning",
    hint: "Awaiting review",
  },
  {
    key: "approved",
    title: "KYC Approved",
    icon: SVGICON.MessageIcon,
    tone: "success",
    hint: "Successfully verified",
  },
  {
    key: "rejected",
    title: "KYC Rejected",
    icon: SVGICON.SettingIcon,
    tone: "danger",
    hint: "Failed verification",
  },
];

const KycAll = () => {
  const [kycSummary, setKycSummary] = useState({
    approved: 0,
    pending: 0,
    rejected: 0,
    total: 0,
  });
  const [loading, setKYCSummaryLoading] = useState(true);

  const approvalRate = useMemo(() => {
    const approved = Number(kycSummary.approved ?? 0);
    const pending = Number(kycSummary.pending ?? 0);
    const rejected = Number(kycSummary.rejected ?? 0);
    // Fall back to the outcome sum when the API omits a total.
    const total =
      Number(kycSummary.total ?? 0) || approved + pending + rejected;

    return total ? Math.round((approved / total) * 100) : 0;
  }, [kycSummary]);

  const overviewSummary = useMemo(
    () => ({
      approved: kycSummary.approved,
      pending: kycSummary.pending,
      rejected: kycSummary.rejected,
      submitted: kycSummary.total,
    }),
    [kycSummary],
  );

  return (
    <>
      <PageTitle motherMenu="KYC" activeMenu="All KYC" />

      <div className="nova-page-hero is-kyc mb-3">
        <div className="nova-page-hero-copy">
          <span className="nova-page-hero-eyebrow">Identity Verification</span>
          <h2 className="nova-page-hero-title mb-2">KYC review and compliance</h2>
          <p className="nova-page-hero-text mb-0">
            Monitor submissions, track approval outcomes, and review applicant
            identity details in one place.
          </p>
        </div>

        {/* Submitted/Pending counts live in the stat grid below, so the hero
            only carries the metric that is not repeated there. */}
        <div className="nova-page-hero-metrics">
          <div className="nova-page-hero-metric is-highlight">
            <span>Approval Rate</span>
            <strong>{loading ? "..." : `${approvalRate}%`}</strong>
          </div>
        </div>
      </div>

      <div className="row g-3 mb-3">
        <div className="col-xl-6">
          <div className="nova-kyc-stat-grid">
            {statCards.map((item) => (
              <InsightStatCard
                key={item.key}
                title={item.title}
                value={loading ? "..." : (kycSummary[item.key] ?? 0)}
                icon={item.icon}
                tone={item.tone}
                hint={item.hint}
              />
            ))}
          </div>
        </div>

        <div className="col-xl-6">
          <KycOverviewCard
            className="nova-kyc-overview h-100"
            kycSummary={overviewSummary}
            loading={loading}
            showUpdatedAt={false}
            subtitle="Share of submissions by review outcome."
          />
        </div>
      </div>

      <KycTable
        title="All KYC Activities"
        setKycSummary={setKycSummary}
        setKYCSummaryLoading={setKYCSummaryLoading}
      />
    </>
  );
};

export default KycAll;
