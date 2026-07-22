import { useCallback, useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { parseNovaDate } from "../../../../utils/novaDateUtils";
import { getStatusSeverity } from "./statusUtils";
import { request } from "../../../../utils/api";
import {
  formatDate,
  formatDateTime,
  getDisplayValue,
  getEmail,
  getFullName,
  normalizeStatusLabel,
} from "../../../../utils";
import TableFilters from "../../../components/utilComponents/TableFilters";
import Loading from "../../../components/utilComponents/Loading";
import { KYC_STATUS_OPTIONS, ORDER_OPTIONS } from "../../../constant/ApplicationModel";

const KYC_ENDPOINT = "/tevau/kyc";
const FILTER_CONFIG = {
  showSearch: true,
  showStatus: true,
  showOrderFilter: true,
};

const getInitials = (value) => {
  const text = String(value || "").trim();
  if (!text) return "NA";
  const parts = text.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] || ""}${parts[1][0] || ""}`.toUpperCase();
};

const KycTable = ({ title, setKYCSummaryLoading, setKycSummary }) => {
  const dt = useRef(null);
  const [loading, setLoading] = useState(false);
  const [kycList, setKycList] = useState([]);
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

  const getKycList = useCallback(
    async (page = 1, activeFilters = {}) => {
      try {
        setLoading(true);
        setKYCSummaryLoading?.(true);

        const params = new URLSearchParams({
          per_page: pagination.per_page,
          page,
        });

        if (activeFilters.search) params.append("search", activeFilters.search);
        if (activeFilters.status) params.append("status", activeFilters.status);
        if (activeFilters.order) params.append("sort_order", activeFilters.order);

        const response = await request({
          url: `${KYC_ENDPOINT}?${params.toString()}`,
          method: "GET",
        });

        setKycSummary?.(response.counts ?? {});
        const records = (response.data?.data || []).map((item) => ({
          ...item,
          fullName: getFullName(item),
          email: getEmail(item),
          identityCard: item.identity_card || "N/A",
          submittedAt: parseNovaDate(item.submitted_at),
          approvedAt: parseNovaDate(item.approved_at),
          identityCardValidityTime: parseNovaDate(
            item.identity_card_validity_time,
          ),
          statusLabel: normalizeStatusLabel(item.status),
        }));

        setKycList(records);
        setPagination((prev) => ({
          ...prev,
          total: response.data?.total || 0,
          current_page: page,
        }));
      } catch (err) {
        console.error(err);
        setKycList([]);
        setKycSummary?.({});
      } finally {
        setLoading(false);
        setKYCSummaryLoading?.(false);
      }
    },
    [pagination.per_page, setKYCSummaryLoading, setKycSummary],
  );

  useEffect(() => {
    setPagination((prev) => ({ ...prev, current_page: 1 }));
    getKycList(1, filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const applicantTemplate = (rowData) => (
    <div className="nova-table-user-cell">
      <div className="nova-table-avatar">{getInitials(rowData.fullName)}</div>
      <div>
        <div className="fw-semibold">{rowData.fullName}</div>
        <div className="text-muted small">{rowData.email}</div>
      </div>
    </div>
  );

  const identityTemplate = (rowData) => (
    <span className="nova-card-id-chip">{rowData.identityCard}</span>
  );

  const statusTemplate = (rowData) => (
    <Tag
      value={rowData.statusLabel}
      severity={getStatusSeverity(rowData.statusLabel)}
    />
  );

  const timelineTemplate = (rowData) => (
    <div className="nova-kyc-timeline">
      <div>
        <span className="text-muted">Submitted</span>
        <strong>{formatDateTime(rowData.submittedAt)}</strong>
      </div>
      {rowData.approvedAt ? (
        <div>
          <span className="text-muted">Approved</span>
          <strong>{formatDateTime(rowData.approvedAt)}</strong>
        </div>
      ) : null}
    </div>
  );

  const validityTemplate = (rowData) => (
    <span className="nova-kyc-date-chip">
      {formatDate(rowData.identityCardValidityTime)}
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
      title="View KYC details"
    >
      <i className="pi pi-eye" />
    </button>
  );

  const exportCSV = () => dt.current?.exportCSV();
  const handleFilterChange = useCallback((updatedFilters) => {
    setFilters(updatedFilters);
  }, []);

  const renderHeader = () => (
    <div className="nova-table-toolbar">
      <div>
        <h4 className="mb-1">{title}</h4>
        <p className="text-muted mb-0">
          Search applicants, filter by status, and review verification records.
        </p>
      </div>

      <TableFilters
        filterConfig={FILTER_CONFIG}
        onFilterChange={handleFilterChange}
        statusOptions={KYC_STATUS_OPTIONS}
        orderOptions={ORDER_OPTIONS}
        exportCSV={exportCSV}
      />
    </div>
  );

  const emptyMessage = loading ? (
    <div className="nova-table-empty-state">
      <Loading />
      <p>Loading KYC records...</p>
    </div>
  ) : (
    <div className="nova-table-empty-state">
      <i className="pi pi-inbox" />
      <h6>No KYC records found</h6>
      <p>Try adjusting your search or filters.</p>
    </div>
  );

  const formatAdditionalDetailValue = (key, value) => {
    if (typeof value !== "string") return value;

    const normalizedKey = key.toLowerCase();
    const isDateField =
      normalizedKey.includes("date") ||
      normalizedKey.includes("birthday") ||
      normalizedKey.endsWith("_at");

    if (!isDateField) return value;

    return normalizedKey.includes("birthday")
      ? formatDate(value)
      : formatDateTime(value);
  };

  const additionalDetailEntries = detailRecord
    ? Object.entries(detailRecord).filter(([key, value]) => {
        const excludedKeys = new Set([
          "id",
          "fullName",
          "email",
          "first_name_en",
          "identity_card",
          "identityCard",
          "identity_back_pic_url",
          "identity_front_pic_url",
          "status",
          "statusLabel",
          "submitted_at",
          "submittedAt",
          "tevau_user_id",
          "user_code",
          "updated_at",
          "approved_at",
          "approvedAt",
          "identity_card_validity_time",
          "identityCardValidityTime",
        ]);

        if (excludedKeys.has(key)) return false;
        if (value === null || value === undefined || value === "") return false;
        if (value instanceof Date) return false;
        if (typeof value === "object") return false;

        return true;
      })
    : [];

  const detailFields = detailRecord
    ? [
        { label: "KYC ID", value: getDisplayValue(detailRecord.id) },
        { label: "Name", value: getDisplayValue(detailRecord.fullName) },
        { label: "Email", value: getDisplayValue(detailRecord.email) },
        {
          label: "Identity Card",
          value: getDisplayValue(detailRecord.identityCard),
        },
        { label: "Status", value: detailRecord.statusLabel },
        {
          label: "Submitted At",
          value: formatDateTime(detailRecord.submittedAt),
        },
        {
          label: "Approved At",
          value: formatDateTime(detailRecord.approvedAt),
        },
        {
          label: "ID Validity",
          value: formatDate(detailRecord.identityCardValidityTime),
        },
      ]
    : [];

  return (
    <>
      <div className="card nova-panel nova-table-panel">
        <div className="card-body">
          <DataTable
            ref={dt}
            value={kycList}
            loading={loading}
            paginator
            lazy
            rows={pagination.per_page}
            totalRecords={pagination.total}
            first={(pagination.current_page - 1) * pagination.per_page}
            onPage={(e) => getKycList(e.page + 1, filters)}
            header={renderHeader()}
            emptyMessage={emptyMessage}
            className="p-datatable-sm nova-table nova-cards-table"
          >
            <Column field="id" header="ID" sortable />
            <Column header="Applicant" body={applicantTemplate} sortable />
            <Column header="Identity" body={identityTemplate} sortable />
            <Column
              field="statusLabel"
              header="Status"
              body={statusTemplate}
              sortable
            />
            <Column header="Timeline" body={timelineTemplate} />
            <Column header="ID Validity" body={validityTemplate} />
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
              <h5 className="modal-title mb-1">KYC Details</h5>
              <p className="text-muted small mb-0">
                Applicant identity information and verification status.
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
                    {getInitials(detailRecord.fullName)}
                  </div>
                  <div>
                    <h5 className="mb-1">{detailRecord.fullName}</h5>
                    <p className="text-muted mb-2">{detailRecord.email}</p>
                    <Tag
                      value={detailRecord.statusLabel}
                      severity={getStatusSeverity(detailRecord.statusLabel)}
                    />
                  </div>
                </div>

                <div className="row g-3 mb-4">
                  <div className="col-md-4">
                    <div className="nova-card-detail-stat">
                      <span>Identity Card</span>
                      <strong>{detailRecord.identityCard}</strong>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="nova-card-detail-stat">
                      <span>Submitted</span>
                      <strong>{formatDateTime(detailRecord.submittedAt)}</strong>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="nova-card-detail-stat is-highlight">
                      <span>ID Validity</span>
                      <strong>
                        {formatDate(detailRecord.identityCardValidityTime)}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="nova-profile-list mb-4">
                  {detailFields.map((field) => (
                    <div className="nova-profile-list-row" key={field.label}>
                      <span>{field.label}</span>
                      <strong>{field.value}</strong>
                    </div>
                  ))}
                </div>

                {additionalDetailEntries.length > 0 && (
                  <>
                    <h6 className="mb-2">Additional Details</h6>
                    <div className="nova-profile-list">
                      {additionalDetailEntries.map(([key, value]) => (
                        <div className="nova-profile-list-row" key={key}>
                          <span>
                            {normalizeStatusLabel(key.replace(/_/g, " "))}
                          </span>
                          <strong>
                            {getDisplayValue(
                              formatAdditionalDetailValue(key, value),
                            )}
                          </strong>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default KycTable;
