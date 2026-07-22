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
  normalizeStatusLabel,
} from "../../../../utils";
import TableFilters from "../../../components/utilComponents/TableFilters";
import Loading from "../../../components/utilComponents/Loading";

const getInitials = (value) => {
  const text = String(value || "").trim();
  if (!text) return "NA";
  const parts = text.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] || ""}${parts[1][0] || ""}`.toUpperCase();
};

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

  const holderTemplate = (rowData) => {
    const email = getEmail(rowData);
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

  const detailFields = detailRecord
    ? [
        { label: "Record ID", value: getDisplayValue(detailRecord.id) },
        { label: "Card ID", value: getDisplayValue(detailRecord.card_id) },
        {
          label: "Card Number",
          value: getDisplayValue(detailRecord.card_number),
        },
        {
          label: "Card Type",
          value: normalizeStatusLabel(detailRecord.card_type),
        },
        {
          label: "Status",
          value: normalizeStatusLabel(detailRecord.status),
        },
        {
          label: "Balance",
          value: formatMoney(detailRecord.balance, detailRecord.currency),
        },
        { label: "Currency", value: getDisplayValue(detailRecord.currency) },
        { label: "Bound", value: detailRecord.is_bound ? "Yes" : "No" },
        {
          label: "Bound At",
          value: formatDateTime(detailRecord.bound_at),
        },
        ...(detailRecord.frozen_at
          ? [
              {
                label: "Frozen At",
                value: formatDateTime(detailRecord.frozen_at),
              },
            ]
          : []),
        { label: "Email", value: getEmail(detailRecord) },
        {
          label: "User Active",
          value:
            detailRecord?.tevau_user?.user?.is_active === undefined
              ? "N/A"
              : detailRecord.tevau_user.user.is_active
                ? "Yes"
                : "No",
        },
        {
          label: "Registered",
          value: formatDateTime(detailRecord.created_at),
        },
      ]
    : [];

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
            <Column header="Cardholder" body={holderTemplate} sortable />
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
        size="lg"
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
                  <div className="nova-table-avatar is-large">
                    {getInitials(getEmail(detailRecord))}
                  </div>
                  <div>
                    <h5 className="mb-1">{getEmail(detailRecord)}</h5>
                    <p className="text-muted mb-2">
                      {getDisplayValue(detailRecord.card_id)}
                    </p>
                    <div className="d-flex flex-wrap gap-2">
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

                <div className="nova-profile-list">
                  {detailFields.map((field) => (
                    <div className="nova-profile-list-row" key={field.label}>
                      <span>{field.label}</span>
                      <strong>{field.value}</strong>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CardTable;
