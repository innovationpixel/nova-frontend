import { useCallback, useEffect, useMemo, useState } from "react";
import { InputNumber } from "primereact/inputnumber";
import Swal from "sweetalert2";
import { request } from "../../../../utils/api";
import Loading from "../../../components/utilComponents/Loading";

const UI_CARD_TYPES = ["Physical", "Virtual"];
const LEVELS = [1, 2];

const CARD_META = {
  Physical: {
    apiType: "PHYSICAL",
    icon: "pi-credit-card",
    accent: "is-physical",
    label: "Physical Card",
    hint: "Higher tier rewards for physical card referrals.",
  },
  Virtual: {
    apiType: "VIRTUAL",
    icon: "pi-wallet",
    accent: "is-virtual",
    label: "Virtual Card",
    hint: "Streamlined rewards for virtual card referrals.",
  },
};

const apiCardType = (uiType) => CARD_META[uiType]?.apiType || "PHYSICAL";

const buildEmptyForm = () =>
  UI_CARD_TYPES.reduce((acc, uiType) => {
    acc[uiType] = LEVELS.reduce((levelAcc, level) => {
      levelAcc[level] = {
        amount_usd: 0,
        is_active: true,
        currency: "USD",
      };
      return levelAcc;
    }, {});
    return acc;
  }, {});

const extractRewardsFromResponse = (res) => {
  const payload = res?.data ?? res;
  if (Array.isArray(payload?.rewards)) return payload.rewards;
  if (Array.isArray(payload)) return payload;
  return [];
};

const mapApiRewardsToForm = (rewardData = [], matrix = {}) => {
  const next = buildEmptyForm();

  UI_CARD_TYPES.forEach((uiType) => {
    const apiType = apiCardType(uiType);

    LEVELS.forEach((level) => {
      const row =
        rewardData.find(
          (item) =>
            String(item?.card_type || "").toUpperCase() === apiType &&
            Number(item?.level) === Number(level),
        ) || {};

      const matrixAmount = Number(matrix?.[apiType]?.[String(level)] ?? 0);

      next[uiType][level] = {
        amount_usd: Number(row.amount_usd ?? matrixAmount ?? 0),
        is_active: row.is_active !== false,
        currency: row.currency ?? "USD",
      };
    });
  });

  return next;
};

const buildSyncPayload = (formRewards) => ({
  rewards: UI_CARD_TYPES.flatMap((uiType) =>
    LEVELS.map((level) => ({
      level,
      card_type: apiCardType(uiType),
      amount_usd: Number(formRewards[uiType]?.[level]?.amount_usd ?? 0),
      is_active: formRewards[uiType]?.[level]?.is_active !== false,
    })),
  ),
});

const formatMoney = (value, currency = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const RewardRule = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeType, setActiveType] = useState("Physical");
  const [formRewards, setFormRewards] = useState(buildEmptyForm);

  const getRewardAmount = useCallback(async () => {
    setLoading(true);
    try {
      const res = await request({ url: "referral/rewards", method: "GET" });
      const payload = res?.data ?? res;
      const rewards = extractRewardsFromResponse(res);
      const matrix = payload?.matrix ?? {};

      setFormRewards(mapApiRewardsToForm(rewards, matrix));
      return { isError: false, response: res };
    } catch (error) {
      console.error(error);
      setFormRewards(buildEmptyForm());
      return { isError: true, error };
    } finally {
      setLoading(false);
    }
  }, []);

  const syncRewardRules = async () => {
    setSaving(true);
    try {
      const response = await request({
        url: "referral/rewards/sync",
        method: "POST",
        data: buildSyncPayload(formRewards),
      });

      await getRewardAmount();

      Swal.fire({
        icon: "success",
        title: "Reward rules saved",
      });

      return { isError: false, response };
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed to save reward rules",
        text:
          error?.response?.data?.message ||
          error?.message ||
          "Please try again.",
      });
      return { isError: true, error };
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    getRewardAmount();
  }, [getRewardAmount]);

  const activeMeta = CARD_META[activeType];
  const tone = activeMeta.accent;

  const activeRewards = useMemo(
    () =>
      LEVELS.map((level) => ({
        level,
        ...formRewards[activeType]?.[level],
      })),
    [activeType, formRewards],
  );

  const activeSummary = useMemo(() => {
    const amounts = activeRewards.map((row) => Number(row.amount_usd || 0));
    const activeCount = activeRewards.filter((row) => row.is_active !== false)
      .length;

    return {
      min: Math.min(...amounts),
      max: Math.max(...amounts),
      activeCount,
    };
  }, [activeRewards]);

  const updateRewardField = (uiType, level, field, value) => {
    setFormRewards((prev) => ({
      ...prev,
      [uiType]: {
        ...prev[uiType],
        [level]: {
          ...prev[uiType][level],
          [field]: value,
        },
      },
    }));
  };

  return (
    <div className={`nova-reward-rules ${tone}`}>
      <div className="nova-reward-rules-head">
        <div className="nova-reward-rules-head-copy">
          <span className="nova-reward-rules-eyebrow">Payout Configuration</span>
          <h4 className="nova-reward-rules-title mb-1">Reward Rules</h4>
          <p className="nova-reward-rules-subtitle mb-0">
            Define referral rewards by card type and referral level.
          </p>
        </div>

        {!loading ? (
          <div className="nova-reward-rules-head-stats">
            <div className="nova-reward-rules-stat">
              <span>Active Tiers</span>
              <strong>
                {activeSummary.activeCount}/{LEVELS.length}
              </strong>
            </div>
            <div className="nova-reward-rules-stat is-highlight">
              <span>Payout Range</span>
              <strong>
                {formatMoney(activeSummary.min)} –{" "}
                {formatMoney(activeSummary.max)}
              </strong>
            </div>
          </div>
        ) : null}
      </div>

      <div className="nova-reward-rules-tabs" role="tablist" aria-label="Card type">
        {UI_CARD_TYPES.map((type) => {
          const meta = CARD_META[type];
          const isActive = activeType === type;

          return (
            <button
              key={type}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`nova-reward-rules-tab ${meta.accent} ${
                isActive ? "is-active" : ""
              }`}
              onClick={() => setActiveType(type)}
            >
              <span className="nova-reward-rules-tab-icon">
                <i className={`pi ${meta.icon}`} />
              </span>
              <span className="nova-reward-rules-tab-copy">
                <strong>{meta.label}</strong>
                <small>{meta.hint}</small>
              </span>
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="nova-reward-rules-loading">
          <Loading />
        </div>
      ) : (
        <>
          <div className="nova-reward-rules-ladder">
            {activeRewards.map((row, index) => {
              const isInactive = row.is_active === false;

              return (
                <article
                  className={`nova-reward-rules-tier ${tone} ${
                    isInactive ? "is-inactive" : ""
                  }`}
                  key={`${activeType}-${row.level}`}
                >
                  {index < activeRewards.length - 1 ? (
                    <span className="nova-reward-rules-connector" aria-hidden />
                  ) : null}

                  <div className="nova-reward-rules-tier-top">
                    <div className="nova-reward-rules-level">
                      <span className="nova-reward-rules-level-ring">
                        L{row.level}
                      </span>
                      <div>
                        <h5 className="mb-0">Level {row.level}</h5>
                        <p className="mb-0">{activeMeta.apiType}</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      className={`nova-reward-rules-toggle ${
                        row.is_active !== false ? "is-on" : ""
                      }`}
                      aria-pressed={row.is_active !== false}
                      onClick={() =>
                        updateRewardField(
                          activeType,
                          row.level,
                          "is_active",
                          !row.is_active,
                        )
                      }
                    >
                      <span className="nova-reward-rules-toggle-track">
                        <span className="nova-reward-rules-toggle-thumb" />
                      </span>
                      <span>{row.is_active !== false ? "Active" : "Paused"}</span>
                    </button>
                  </div>

                  <div className="nova-reward-rules-amount">
                    <label
                      htmlFor={`reward-amount-${activeType}-${row.level}`}
                      className="nova-reward-rules-amount-label"
                    >
                      Reward payout
                    </label>
                    <div className="nova-reward-rules-amount-field">
                      <InputNumber
                        inputId={`reward-amount-${activeType}-${row.level}`}
                        value={row.amount_usd}
                        onValueChange={(event) =>
                          updateRewardField(
                            activeType,
                            row.level,
                            "amount_usd",
                            event.value ?? 0,
                          )
                        }
                        mode="currency"
                        currency={row.currency || "USD"}
                        locale="en-US"
                        min={0}
                        className="nova-reward-rules-input"
                        inputClassName="nova-reward-rules-input-native"
                        disabled={isInactive}
                      />
                    </div>
                    <p className="nova-reward-rules-amount-hint mb-0">
                      Referrers earn{" "}
                      <strong>{formatMoney(row.amount_usd, row.currency)}</strong>{" "}
                      per successful {activeType.toLowerCase()} referral.
                    </p>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="nova-reward-rules-foot">
            <p className="nova-reward-rules-foot-note mb-0">
              Saving updates all physical and virtual reward tiers.
            </p>
            <button
              type="button"
              className="btn btn-primary btn-sm nova-reward-rules-save"
              disabled={loading || saving}
              onClick={syncRewardRules}
            >
              <i
                className={`pi ${saving ? "pi-spin pi-spinner" : "pi-check"} me-2`}
              />
              {saving ? "Saving..." : "Save Rules"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default RewardRule;
