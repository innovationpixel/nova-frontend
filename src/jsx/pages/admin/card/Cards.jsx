import { useEffect, useState } from "react";
import { request } from "../../../../utils/api";
import PageTitle from "../../../layouts/PageTitle";
import InsightStatCard from "../components/InsightStatCard";
import CardOfferingsPanel from "../components/CardOfferingsPanel";
import PlatformFees from "./PlatformFees";
import CardTable from "./CardTable";
import SetCardFees from "./SetCardFees";
import { SVGICON } from "../../../constant/theme";

const statCards = [
  {
    key: "total",
    title: "Total Cards",
    icon: SVGICON.DashboardSvg,
    tone: "primary",
    hint: "All issued cards",
  },
  {
    key: "active",
    title: "Active Cards",
    icon: SVGICON.ProfileSvg,
    tone: "success",
    hint: "Currently active",
  },
  {
    key: "inactive",
    title: "Inactive Cards",
    icon: SVGICON.ExtraSvgIcon,
    tone: "warning",
    hint: "Not in use",
  },
  {
    key: "pending",
    title: "Pending Cards",
    icon: SVGICON.Notification,
    tone: "info",
    hint: "Awaiting activation",
  },
  {
    key: "closed",
    title: "Closed Cards",
    icon: SVGICON.SettingSvgIcon,
    tone: "secondary",
    hint: "Permanently closed",
  },
  {
    key: "frozen",
    title: "Frozen Cards",
    icon: SVGICON.MessageSvgIcon,
    tone: "danger",
    hint: "Temporarily frozen",
  },
  {
    key: "cancelled",
    title: "Cancelled Cards",
    icon: SVGICON.SideBarDot,
    tone: "dark",
    hint: "Cancelled by user",
  },
];

const Cards = () => {
  const [cardProducts, setCardProducts] = useState([]);
  const [cardProductsLoading, setCardProductsLoading] = useState(true);
  const [cardTableLoading, setCardTableLoading] = useState(true);
  const [cardSummaryData, setCardSummaryData] = useState({});

  const getCardProducts = async () => {
    setCardProductsLoading(true);
    try {
      const res = await request({
        url: "card-products",
        method: "GET",
      });
      setCardProducts(res?.data?.data ?? []);
    } catch (error) {
      console.error(error);
      setCardProducts([]);
    } finally {
      setCardProductsLoading(false);
    }
  };

  useEffect(() => {
    getCardProducts();
  }, []);

  const activeCount = cardSummaryData.active ?? 0;
  const totalCount = cardSummaryData.total ?? 0;
  const activeRate = totalCount
    ? Math.round((activeCount / totalCount) * 100)
    : 0;

  return (
    <>
      <PageTitle motherMenu="Cards" activeMenu="Card Management" />

      <div className="nova-page-hero is-cards mb-3">
        <div className="nova-page-hero-copy">
          <span className="nova-page-hero-eyebrow">Card Management</span>
          <h2 className="nova-page-hero-title mb-2">
            Manage inventory, fees, and issued cards
          </h2>
          <p className="nova-page-hero-text mb-0">
            Configure virtual and physical card offerings, platform fees, and
            monitor the full card lifecycle from one workspace.
          </p>
        </div>

        {/* Total/Active counts live in the stat grid below, so the hero only
            carries the one metric that is not repeated there. */}
        <div className="nova-page-hero-metrics">
          <div className="nova-page-hero-metric is-highlight">
            <span>Active Rate</span>
            <strong>{cardTableLoading ? "..." : `${activeRate}%`}</strong>
          </div>
        </div>
      </div>

      <div className="nova-stat-grid mb-3">
        {statCards.map((card) => (
          <InsightStatCard
            key={card.key}
            title={card.title}
            value={cardTableLoading ? "..." : (cardSummaryData[card.key] ?? 0)}
            icon={card.icon}
            tone={card.tone}
            hint={card.hint}
          />
        ))}
      </div>

      <CardOfferingsPanel
        products={cardProducts}
        loading={cardProductsLoading}
      />

      <SetCardFees cardProducts={cardProducts} onSaved={getCardProducts} />

      <PlatformFees />

      <CardTable
        setCardSummaryData={setCardSummaryData}
        setCardTableLoading={setCardTableLoading}
      />
    </>
  );
};

export default Cards;
