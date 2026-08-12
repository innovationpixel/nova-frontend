import { useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { request } from "../../../../utils/api";
import { getStatusSeverity } from "../components/statusUtils";
import { CARD_STATUS, ORDER_OPTIONS } from "../../../constant/ApplicationModel";
import {
  formatDateTime,
  formatMoney,
  getDisplayValue,
  getEmail,
  normalizeCardType,
  normalizeStatusLabel,
  resolveImageSrc,
} from "../../../../utils";
import TableFilters from "../../../components/utilComponents/TableFilters";
import Loading from "../../../components/utilComponents/Loading";
import { buildRecordDetails, dedupeGroups } from "../components/recordDetails";
import { cardInventory } from "../../../data/adminData";

const getInitials = (value) => {
  const text = String(value || "").trim();
  if (!text) return "NA";
  const parts = text.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] || ""}${parts[1][0] || ""}`.toUpperCase();
};

// Rendered in the hero, the stat tiles or the curated groups, so the automatic
// "everything else" pass does not repeat them.
const SUMMARY_KEYS = [
  "id",
  "card_id",
  "card_number",
  "card_type",
  "status",
  "balance",
  "currency",
  "is_bound",
  "bound_at",
  "frozen_at",
  "created_at",
  "updated_at",
];

const FALLBACK_ARTWORK = new Map(
  cardInventory.map((card) => [card.type, card.image]),
);

const CardTable = ({ setCardTableLoading, setCardSummaryData }) => {
  const dt = useRef(null);
  const [loader, setLoader] = useState(true);
  const [cardData, setCardData] = useState([]);
  const [detailRecord, setDetailRecord] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    per_page: 15,
    current_page: 1,
  });
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    order: "desc",
  });
  const [cardArtwork, setCardArtwork] = useState({});

  const filterConfig = {
    showSearch: true,
    showStatus: true,
    showOrderFilter: true,
    url: "tevau/cards",
  };

  const getCardData = async (page = 1, activeFilters = filters) => {
    setLoader(true);
    setCardTableLoading(true);
    try {
      const params = new URLSearchParams({
        per_page: pagination.per_page,
        page,
      });

      if (activeFilters.search) params.append("search", activeFilters.search);
      if (activeFilters.status) params.append("status", activeFilters.status);
      if (activeFilters.order) params.append("sort_order", activeFilters.order);

      const res = await request({
        url: `${filterConfig.url}?${params.toString()}`,
        method: "GET",
      });
      const payload = res?.data?.data ?? [];
      const meta = res.data;
      setCardSummaryData(res.counts ?? {});
      setCardData(payload);
      setPagination((prev) => ({
        ...prev,
        total: meta.total ?? 0,
        current_page: meta.current_page ?? page,
        per_page: meta.per_page ?? prev.per_page,
      }));
    } catch (error) {
      console.error(error);
      setCardData([]);
      setCardSummaryData({});
    } finally {
      setLoader(false);
      setCardTableLoading(false);
    }
  };

  useEffect(() => {
    setPagination((prev) => ({ ...prev, current_page: 1 }));
    getCardData(1, filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  // Card artwork lives on the products endpoint, keyed by card type.
  useEffect(() => {
    let cancelled = false;

    const getCardArtwork = async () => {
      try {
        const res = await request({ url: "card-products", method: "GET" });
        const artwork = {};

        (res?.data?.data ?? []).forEach((product) => {
          const type = normalizeCardType(product.card_type);
          const src = resolveImageSrc(product.image_url);
          if (type && src && !artwork[type]) artwork[type] = src;
        });

        if (!cancelled) setCardArtwork(artwork);
      } catch (error) {
        console.error(error);
      }
    };

    getCardArtwork();
    return () => {
      cancelled = true;
    };
  }, []);

  const artworkFor = (cardType) => {
    const type = normalizeCardType(cardType);
    return cardArtwork[type] || FALLBACK_ARTWORK.get(type) || "";
  };

  const cardTemplate = (rowData) => (
    <div>
      <span className="nova-card-id-chip">
        {getDisplayValue(rowData.card_id)}
      </span>
      {rowData.card_number ? (
        <div className="text-muted small mt-1">
          {getDisplayValue(rowData.card_number)}
        </div>
      ) : null}
    </div>
  );

  // Signup email of the linked account. The column is only rendered when the
  // API actually returns it for at least one card.
  const hasCardholderData = cardData.some((row) => getEmail(row) !== "N/A");

  const holderTemplate = (rowData) => {
    const email = getEmail(rowData);
    if (email === "N/A") {
      return <span className="text-muted">Not linked</span>;
    }

    return (
      <div className="nova-table-user-cell">
        <div className="nova-table-avatar">{getInitials(email)}</div>
        <div>
          <div className="fw-semibold">{email}</div>
          <div className="text-muted small">
            Record #{getDisplayValue(rowData.id)}
          </div>
        </div>
      </div>
    );
  };

  const typeTemplate = (rowData) => {
    const type = normalizeStatusLabel(rowData.card_type);
    const tone =
      String(rowData.card_type || "").toLowerCase() === "physical"
        ? "is-physical"
        : "is-virtual";
    return <span className={`nova-card-type-badge ${tone}`}>{type}</span>;
  };

  const statusTemplate = (rowData) => {
    const label = normalizeStatusLabel(rowData.status);
    return <Tag value={label} severity={getStatusSeverity(label)} />;
  };

  const balanceTemplate = (rowData) => (
    <span className="nova-card-balance">
      {formatMoney(rowData.balance, rowData.currency)}
    </span>
  );

  const boundTemplate = (rowData) => (
    <span
      className={`nova-card-bound-chip ${
        rowData.is_bound ? "is-bound" : "is-unbound"
      }`}
    >
      {rowData.is_bound ? "Bound" : "Unbound"}
    </span>
  );

  const actionTemplate = (rowData) => (
    <button
      type="button"
      className="nova-table-action-btn"
      onClick={() => {
        setDetailRecord(rowData);
        setDetailOpen(true);
      }}
      title="View card details"
    >
      <i className="pi pi-eye" />
    </button>
  );

  const exportCSV = () => dt.current?.exportCSV();

  const renderHeader = () => (
    <div className="nova-table-toolbar">
      <div>
        <h4 className="mb-1">Issued Cards</h4>
        <p className="text-muted mb-0">
          Search and review all virtual and physical cards in circulation.
        </p>
      </div>

      <TableFilters
        filterConfig={filterConfig}
        onFilterChange={(updatedFilters) => setFilters(updatedFilters)}
        statusOptions={CARD_STATUS}
        orderOptions={ORDER_OPTIONS}
        exportCSV={exportCSV}
      />
    </div>
  );

  const emptyMessage = loader ? (
    <div className="nova-table-empty-state">
      <Loading />
      <p>Loading issued cards...</p>
    </div>
  ) : (
    <div className="nova-table-empty-state">
      <i className="pi pi-inbox" />
      <h6>No cards found</h6>
      <p>Try adjusting your search or filters.</p>
    </div>
  );

  const detailEmailValue = detailRecord ? getEmail(detailRecord) : "N/A";
  const detailEmail = detailEmailValue === "N/A" ? "" : detailEmailValue;

  // Card ID, type, status, balance, binding, currency and the email are already
  // rendered in the hero and the stat tiles, so they are not repeated as rows.
  const alreadyShownPairs = detailRecord
    ? [
        `Email|${detailEmailValue}`,
        `Card ID|${getDisplayValue(detailRecord.card_id)}`,
        `Status|${normalizeStatusLabel(detailRecord.status)}`,
        `Card Type|${normalizeStatusLabel(detailRecord.card_type)}`,
        `Balance|${formatMoney(detailRecord.balance, detailRecord.currency)}`,
        `Currency|${getDisplayValue(detailRecord.currency)}`,
      ]
    : [];

  const autoDetails = buildRecordDetails(detailRecord, {
    skipKeys: SUMMARY_KEYS,
    rootTitle: "Other Card Fields",
  });

  const rawDetailGroups = detailRecord
    ? [
        {
          title: "Card Information",
          fields: [
            { label: "Record ID", value: getDisplayValue(detailRecord.id) },
            {
              label: "Card Number",
              value: getDisplayValue(detailRecord.card_number),
            },
          ],
        },
        {
          title: "Timeline",
          fields: [
            { label: "Bound At", value: formatDateTime(detailRecord.bound_at) },
            {
              label: "Frozen At",
              value: formatDateTime(detailRecord.frozen_at),
            },
            {
              label: "Registered",
              value: formatDateTime(detailRecord.created_at),
            },
            {
              label: "Last Updated",
              value: formatDateTime(detailRecord.updated_at),
            },
          ],
        },
        // Anything else the endpoint returns, including nested relations.
        ...autoDetails.groups,
      ]
    : [];

  // Only surface what the API actually sends, once: empty values are dropped,
  // and a label/value pair is never printed twice across the whole modal.
  const detailGroups = dedupeGroups(rawDetailGroups, alreadyShownPairs);

  return (
    <>
      <div className="card nova-panel nova-table-panel">
        <div className="card-body">
          <DataTable
            value={cardData}
            loading={loader}
            className="p-datatable-sm nova-table nova-cards-table"
            header={renderHeader()}
            emptyMessage={emptyMessage}
            paginator
            lazy
            ref={dt}
            rows={pagination.per_page}
            totalRecords={pagination.total}
            first={(pagination.current_page - 1) * pagination.per_page}
            onPage={(e) => {
              const nextPage = e.page + 1;
              getCardData(nextPage, filters);
            }}
          >
            <Column header="Card" body={cardTemplate} sortable />
            {hasCardholderData ? (
              <Column header="Cardholder" body={holderTemplate} sortable />
            ) : null}
            <Column field="card_type" header="Type" body={typeTemplate} sortable />
            <Column field="status" header="Status" body={statusTemplate} sortable />
            <Column field="balance" header="Balance" body={balanceTemplate} sortable />
            <Column header="Binding" body={boundTemplate} sortable />
            <Column header="Action" body={actionTemplate} />
          </DataTable>
        </div>
      </div>

      <Modal
        show={detailOpen}
        onHide={() => setDetailOpen(false)}
        centered
        scrollable
        size="xl"
        className="nova-cards-modal"
      >
        <div className="modal-content">
          <div className="modal-header border-0 pb-0">
            <div>
              <h5 className="modal-title mb-1">Card Details</h5>
              <p className="text-muted small mb-0">
                Card status, balance, and linked user information.
              </p>
            </div>
            <button
              type="button"
              className="btn-close"
              onClick={() => setDetailOpen(false)}
            />
          </div>

          <div className="modal-body pt-2">
            {detailRecord && (
              <>
                <div className="nova-table-detail-hero">
                  {artworkFor(detailRecord.card_type) ? (
                    <div className="nova-detail-hero-art">
                      <img
                        src={artworkFor(detailRecord.card_type)}
                        alt={`${normalizeStatusLabel(
                          detailRecord.card_type,
                        )} card`}
                      />
                    </div>
                  ) : (
                    <div className="nova-table-avatar is-large">
                      {detailEmail ? (
                        getInitials(detailEmail)
                      ) : (
                        <i className="pi pi-credit-card" />
                      )}
                    </div>
                  )}
                  <div>
                    <h5 className="mb-1">
                      {detailEmail || getDisplayValue(detailRecord.card_id)}
                    </h5>
                    <p className="text-muted mb-2">
                      {detailEmail
                        ? getDisplayValue(detailRecord.card_id)
                        : "Not linked to a user account"}
                    </p>
                    <div className="nova-profile-badges">
                      <Tag
                        value={normalizeStatusLabel(detailRecord.status)}
                        severity={getStatusSeverity(
                          normalizeStatusLabel(detailRecord.status),
                        )}
                      />
                      <span
                        className={`nova-card-type-badge ${
                          String(detailRecord.card_type || "").toLowerCase() ===
                          "physical"
                            ? "is-physical"
                            : "is-virtual"
                        }`}
                      >
                        {normalizeStatusLabel(detailRecord.card_type)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="row g-3 mb-4">
                  <div className="col-md-4">
                    <div className="nova-card-detail-stat">
                      <span>Balance</span>
                      <strong>
                        {formatMoney(
                          detailRecord.balance,
                          detailRecord.currency,
                        )}
                      </strong>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="nova-card-detail-stat">
                      <span>Binding</span>
                      <strong>
                        {detailRecord.is_bound ? "Bound" : "Unbound"}
                      </strong>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="nova-card-detail-stat is-highlight">
                      <span>Currency</span>
                      <strong>{getDisplayValue(detailRecord.currency)}</strong>
                    </div>
                  </div>
                </div>

                {detailGroups.map((group) => (
                  <div className="nova-detail-group" key={group.title}>
                    <h6 className="nova-detail-group-title">{group.title}</h6>
                    <div className="nova-detail-grid">
                      {group.fields.map((field) => (
                        <div
                          className="nova-profile-list-row"
                          key={`${group.title}-${field.label}`}
                        >
                          <span>{field.label}</span>
                          <strong>{field.value}</strong>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CardTable;
