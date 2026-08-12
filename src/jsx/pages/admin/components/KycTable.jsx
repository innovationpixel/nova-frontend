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
import { buildRecordDetails, dedupeGroups } from "./recordDetails";

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

/** A scan that 404s is dropped rather than left as a broken placeholder. */
const DocumentCard = ({ image }) => {
  const [failed, setFailed] = useState(false);
  if (failed) return null;

  return (
    <a
      className="nova-doc-card"
      href={image.src}
      target="_blank"
      rel="noreferrer"
      title={`Open ${image.label} full size`}
    >
      <span className="nova-doc-card-media">
        <img
          src={image.src}
          alt={image.label}
          onError={() => setFailed(true)}
        />
      </span>
      <span className="nova-doc-card-label">
        {image.label}
        <i className="pi pi-external-link" />
      </span>
    </a>
  );
};

const DocumentThumb = ({ src }) => {
  const [failed, setFailed] = useState(false);
  if (failed) return null;

  return (
    <a
      className="nova-doc-thumb"
      href={src}
      target="_blank"
      rel="noreferrer"
      title="Open document"
    >
      <img src={src} alt="Identity document" onError={() => setFailed(true)} />
    </a>
  );
};

// Values the list mapper derives for the table, plus everything the hero and
// the summary tiles already render. The rest of the record is shown as-is.
const DERIVED_KEYS = [
  "fullName",
  "email",
  "identityCard",
  "submittedAt",
  "approvedAt",
  "identityCardValidityTime",
  "statusLabel",
];

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

  // Key-agnostic and de-duplicated: one thumbnail per document.
  const rowDocuments = (rowData) => buildRecordDetails(rowData).images;

  const hasDocuments = kycList.some((row) => rowDocuments(row).length > 0);

  const documentsTemplate = (rowData) => {
    const documents = rowDocuments(rowData);
    if (!documents.length) {
      return <span className="text-muted small">No scans</span>;
    }

    return (
      <div className="nova-doc-thumbs">
        {documents.map((image) => (
          <DocumentThumb key={image.src} src={image.src} />
        ))}
      </div>
    );
  };

  const statusTemplate = (rowData) => (
    <Tag
      value={rowData.statusLabel}
      severity={getStatusSeverity(rowData.statusLabel)}
    />
  );

  const timelineTemplate = (rowData) => (
    <div className="nova-kyc-timeline">
      <strong>{formatDateTime(rowData.submittedAt)}</strong>
      {rowData.approvedAt ? (
        <span className="text-muted small">
          Approved {formatDate(rowData.approvedAt)}
        </span>
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

  // Everything the endpoint returns, with the document scans split out so they
  // render as images instead of raw URLs.
  const autoDetails = buildRecordDetails(detailRecord, {
    skipKeys: [
      ...DERIVED_KEYS,
      "id",
      "status",
      "identity_card",
      "submitted_at",
      "approved_at",
      "identity_card_validity_time",
    ],
    rootTitle: "Applicant Record",
  });

  const alreadyShownPairs = detailRecord
    ? [
        `Full Name|${getDisplayValue(detailRecord.fullName)}`,
        `Email|${getDisplayValue(detailRecord.email)}`,
        `Identity Card|${getDisplayValue(detailRecord.identityCard)}`,
        `Status|${detailRecord.statusLabel}`,
      ]
    : [];

  const detailGroups = detailRecord
    ? dedupeGroups(
        [
          {
            title: "Verification",
            fields: [
              { label: "KYC ID", value: getDisplayValue(detailRecord.id) },
              {
                label: "Approved At",
                value: formatDateTime(detailRecord.approvedAt),
              },
            ],
          },
          ...autoDetails.groups,
        ],
        alreadyShownPairs,
      )
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
            <Column header="Applicant" body={applicantTemplate} sortable />
            <Column header="Identity" body={identityTemplate} sortable />
            {hasDocuments ? (
              <Column header="Documents" body={documentsTemplate} />
            ) : null}
            <Column
              field="statusLabel"
              header="Status"
              body={statusTemplate}
              sortable
            />
            <Column header="Submitted" body={timelineTemplate} sortable />
            <Column header="ID Validity" body={validityTemplate} />
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

                {autoDetails.images.length > 0 && (
                  <div className="nova-detail-group">
                    <h6 className="nova-detail-group-title">Documents</h6>
                    <div className="nova-doc-grid">
                      {autoDetails.images.map((image) => (
                        <DocumentCard key={image.src} image={image} />
                      ))}
                    </div>
                  </div>
                )}

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

export default KycTable;
