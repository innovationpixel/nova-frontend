import { useEffect, useMemo, useState } from "react";
import { request } from "../../../../utils/api";
import { cardInventory, cardSubscriptions } from "../../../data/adminData";
import { formatCardMoney, normalizeCardType, normalizeStatusLabel } from "../../../../utils";

const CARD_TYPE_DETAILS = {
  Virtual: {
    tagline: "Instant digital card for secure online spending.",
    delivery: "Instant",
    features: ["Instant issue", "Spend controls"],
  },
  Physical: {
    tagline: "Premium physical card for daily spend and ATM access.",
    delivery: "3-5 business days",
    features: ["NFC tap-to-pay", "ATM access"],
  },
};

const resolveAvailability = (product) => {
  const status = normalizeStatusLabel(product?.status);
  if (status === "Active" || status === "Available") return "Available";
  if (status === "Inactive" || status === "Paused" || status === "Disabled")
    return "Paused";
  if (product?.is_active === true) return "Available";
  if (product?.is_active === false) return "Paused";
  return "Available";
};

const CardOfferingsPanel = () => {
  const [cardProducts, setCardProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCardProducts = async () => {
      setLoading(true);
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
        setLoading(false);
      }
    };

    fetchCardProducts();
  }, []);

  const cards = useMemo(() => {
    const fallbackMap = new Map(cardInventory.map((card) => [card.type, card]));
    const productMap = new Map();

    cardProducts.forEach((product) => {
      const type = normalizeCardType(product.card_type || product.type);
      if (!type || productMap.has(type)) return;
      productMap.set(type, product);
    });

    return ["Virtual", "Physical"].map((type) => {
      const product = productMap.get(type);
      const fallback = fallbackMap.get(type);

      return {
        id: product?.id ?? fallback?.id ?? type,
        name: product?.name || fallback?.name || `Nova ${type}`,
        type,
        fee: Number(product?.price ?? fallback?.fee ?? 0),
        discount: Number(product?.discount ?? 0),
        status: resolveAvailability(product),
        image: product?.image_url || fallback?.image,
        description: product?.description || fallback?.description,
        delivery: product?.delivery,
      };
    });
  }, [cardProducts]);

  const activeSubs = cardSubscriptions.filter(
    (sub) => sub.status === "Active",
  ).length;
  const cardCount = loading ? "..." : cards.length;

  return (
    <div className="row g-3 mb-3">
      <div className="col-12">
        <div className="card nova-panel">
          <div className="card-body">
            <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
              <div>
                <h4 className="mb-1">Card Offerings</h4>
                <p className="mb-0 text-muted">
                  Active subscribers: {activeSubs} | {cardCount} card types live
                </p>
              </div>
              <span className="badge bg-light text-dark">
                {cardCount} cards live
              </span>
            </div>

            <div className="nova-card-grid">
              {cards.map((card) => {
                const details = CARD_TYPE_DETAILS[card.type] || {};
                const features = card.features ?? details.features ?? [];
                const statusClass =
                  card.status === "Available" ? "is-available" : "is-paused";

                return (
                  <div
                    key={card.id}
                    className={`nova-card-tile is-${card.type.toLowerCase()}`}
                  >
                    <div className="nova-card-tile-content">
                      <div className="nova-card-badges">
                        <span className="nova-card-chip">{card.type} Card</span>
                        <span className={`nova-card-status ${statusClass}`}>
                          {card.status}
                        </span>
                      </div>

                      <h5 className="nova-card-name">{card.name}</h5>
                      <p className="nova-card-desc">
                        {card.description ?? details.tagline}
                      </p>

                      <div className="nova-card-meta">
                        <div>
                          <span className="nova-card-meta-label">Price</span>
                          <span className="nova-card-meta-value">
                            {formatCardMoney(card.fee)}
                          </span>
                        </div>
                        <div>
                          <span className="nova-card-meta-label">
                            Discounted Price
                          </span>
                          <span className="nova-card-meta-value">
                            {formatCardMoney(card.discount ?? 0)}
                          </span>
                        </div>
                        <div>
                          <span className="nova-card-meta-label">Delivery</span>
                          <span className="nova-card-meta-value">
                            {card.delivery ?? details.delivery}
                          </span>
                        </div>
                      </div>

                      {features.length > 0 && (
                        <div className="nova-card-features">
                          {features.map((feature) => (
                            <span
                              key={`${card.id}-${feature}`}
                              className="nova-card-feature"
                            >
                              <i className="pi pi-check-circle" />
                              {feature}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="nova-card-visual">
                      <img
                        src={card.image}
                        alt={`${card.name} preview`}
                        className="nova-card-hero"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardOfferingsPanel;
