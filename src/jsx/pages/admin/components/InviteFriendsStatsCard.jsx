import { useEffect, useMemo, useState } from "react";
import { request } from "../../../../utils/api";
import Loading from "../../../components/utilComponents/Loading";

const InviteFriendsStatsCard = ({className}) => {
  const [inviteRewards, setInviteRewards] = useState([]);
  const [loading, setLoading] = useState(false);

  const getInviteRewards = async () => {
    setLoading(true);
    try {
      const res = await request({
        url: "referral/stats",
        method: "GET",
      });
      setInviteRewards(res.data);
    } catch (error) {
      console.error(error);
      setInviteRewards([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getInviteRewards();
  }, []);

 const levelStats = useMemo(() => {
    if (!inviteRewards?.by_level) return [];

    return Object.entries(inviteRewards.by_level).map(
      ([level, stats]) => ({
        level,
        invites: stats.total_referral_invites,
        payout: stats.total_rewarded_usd,
      })
    );
  }, [inviteRewards]);

  return (
    <>
      {loading ? (
        <div className="card nova-panel">
          <div className="card-body py-5 text-center">
            <Loading />
          </div>
        </div>
      ) : (
        <div className={`card nova-panel ${className}`.trim()}>
          <div className="card-body">
            <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
              <div>
                <h4 className="mb-1">Invite Friends</h4>
                <p className="text-muted mb-0">
                  Referral rewards across payout tiers.
                </p>
              </div>
              <span className="badge bg-light text-dark">
                Total {inviteRewards.total_referral_invites?.toLocaleString()}{" "}
                invites
              </span>
            </div>

            <div className="row g-3 mb-3">
              <div className="col-6">
                <div className="border rounded p-3 h-100">
                  <span className="text-muted small">Total Invites</span>
                  <h4 className="mb-0">
                    {inviteRewards.total_referral_invites?.toLocaleString()}
                  </h4>
                </div>
              </div>
              <div className="col-6">
                <div className="border rounded p-3 h-100">
                  <span className="text-muted small">Estimated Payout</span>
                  <h4 className="mb-0">
                    ${inviteRewards.total_rewarded_usd?.toLocaleString()}
                  </h4>
                </div>
              </div>
            </div>

            <div className="d-grid gap-3">
             {levelStats.map((lvl) => (
                <div
                  className="border rounded p-3"
                  key={`level-${lvl.level}`}
                >
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <strong>Level {lvl.level}</strong>
                    <span className="badge bg-primary">
                      {lvl.invites?.toLocaleString()} invites
                    </span>
                  </div>

                  <div className="d-flex justify-content-between small text-muted">
                    <span>Invites: {lvl.invites?.toLocaleString()}</span>
                    <span>Payout: ${lvl.payout?.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InviteFriendsStatsCard;
