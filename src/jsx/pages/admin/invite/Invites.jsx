import { useEffect, useMemo, useState } from "react";
import { SVGICON } from "../../../constant/theme";
import { request } from "../../../../utils/api";
import PageTitle from "../../../layouts/PageTitle";
import RewardRule from "./RewardRule";
import InviteOverview from "./InviteOverview";
import InviteTable from "./InviteTable";
import InsightStatCard from "../components/InsightStatCard";

const statCards = [
  {
    key: "totalInvites",
    title: "Total Invites",
    icon: SVGICON.PatientUser,
    tone: "primary",
    hint: "All referral invites sent",
  },
  {
    key: "acceptedInvites",
    title: "Invites Accepted",
    icon: SVGICON.ArrowGreen,
    tone: "success",
    hint: "Users who joined successfully",
  },
  {
    key: "pendingInvites",
    title: "Invites Pending",
    icon: SVGICON.ArrowRed,
    tone: "warning",
    hint: "Awaiting user action",
  },
  {
    key: "estimatedPayout",
    title: "Estimated Payout",
    icon: SVGICON.DollerSvg,
    tone: "info",
    prefix: "$",
    hint: "Total rewarded amount",
  },
];

const Invites = () => {
  const [loadingInviteList, setLoadingInviteList] = useState(true);
  const [inviteCounts, setInviteCounts] = useState({});
  const [referralStats, setReferralStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    const fetchReferralStats = async () => {
      setStatsLoading(true);
      try {
        const res = await request({
          url: "referral/stats",
          method: "GET",
        });
        setReferralStats(res?.data ?? null);
      } catch (error) {
        console.error(error);
        setReferralStats(null);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchReferralStats();
  }, []);

  const metrics = useMemo(() => {
    const total =
      referralStats?.total_referral_invites ?? inviteCounts.totalInvites ?? 0;
    const accepted = inviteCounts.acceptedInvites ?? 0;
    const pending = inviteCounts.pendingInvites ?? 0;
    const payout =
      inviteCounts.estimatedPayout ?? referralStats?.total_rewarded_usd ?? 0;
    const acceptanceRate = total
      ? Math.round((accepted / total) * 100)
      : 0;

    return { total, accepted, pending, payout, acceptanceRate };
  }, [inviteCounts, referralStats]);

  const formatStatValue = (card) => {
    if (loadingInviteList && statsLoading) return "...";

    if (card.key === "totalInvites") {
      return metrics.total.toLocaleString();
    }

    if (card.key === "estimatedPayout") {
      return `${card.prefix || ""}${Number(metrics.payout).toLocaleString()}`;
    }

    const value = inviteCounts[card.key] ?? 0;
    return Number(value).toLocaleString();
  };

  return (
    <>
      <PageTitle motherMenu="Invites" activeMenu="Invite Friends" />

      <div className="nova-page-hero is-invites mb-3">
        <div className="nova-page-hero-copy">
          <span className="nova-page-hero-eyebrow">Referral Program</span>
          <h2 className="nova-page-hero-title mb-2">Grow Nova with invite rewards</h2>
          <p className="nova-page-hero-text mb-0">
            Monitor referral activity, manage payout rules, and review user-level
            earnings from one place.
          </p>
        </div>

        {/* Invite totals and payout live in the stat cards below, so the hero
            only carries the metric that is not repeated there. */}
        <div className="nova-page-hero-metrics">
          <div className="nova-page-hero-metric is-highlight">
            <span>Acceptance Rate</span>
            <strong>
              {statsLoading && loadingInviteList
                ? "..."
                : `${metrics.acceptanceRate}%`}
            </strong>
          </div>
        </div>
      </div>

      <div className="nova-stat-grid mb-3">
        {statCards.map((card) => (
          <InsightStatCard
            key={card.key}
            title={card.title}
            value={formatStatValue(card)}
            icon={card.icon}
            tone={card.tone}
            hint={card.hint}
          />
        ))}
      </div>

      {/* Full width, one per row: side by side these two never matched height,
          which left a tall gap under the shorter panel. */}
      <div className="mb-3">
        <RewardRule />
      </div>

      <div className="mb-3">
        <InviteOverview stats={referralStats} loading={statsLoading} />
      </div>

      <InviteTable
        setInviteList={setInviteCounts}
        setLoadingInviteList={setLoadingInviteList}
      />
    </>
  );
};

export default Invites;
