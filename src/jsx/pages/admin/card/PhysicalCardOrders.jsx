import { useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { request } from "../../../../utils/api";
import { getStatusSeverity } from "../components/statusUtils";
import {
  formatDateTime,
  getCityName,
  getCountryName,
  getDisplayValue,
  getEmail,
  getFullAddress,
  getFullName,
  getPhoneNumber,
  normalizeStatusLabel,
} from "../../../../utils";
import {
  ORDER_OPTIONS,
  PHYSICAL_CARD_STATUS,
} from "../../../constant/ApplicationModel";
import { SVGICON } from "../../../constant/theme";
import PageTitle from "../../../layouts/PageTitle";
import TableFilters from "../../../components/utilComponents/TableFilters";
import InsightStatCard from "../components/InsightStatCard";
import Loading from "../../../components/utilComponents/Loading";
import Swal from "sweetalert2";

const statCards = [
  {
    key: "total",
    title: "Total Orders",
    icon: SVGICON.BillsSvg,
    tone: "primary",
    hint: "All physical card orders",
  },
  {
    key: "processing",
    title: "Processing",
    icon: SVGICON.WidgetIcon,
    tone: "info",
    hint: "Being prepared",
  },
  {
    key: "shipped",
    title: "Shipped",
    icon: SVGICON.BillsSvg,
    tone: "warning",
    hint: "In transit",
  },
  {
    key: "pending",
    title: "Pending",
    icon: SVGICON.Notification,
    tone: "secondary",
    hint: "Awaiting action",
  },
  {
    key: "delivered",
    title: "Delivered",
    icon: SVGICON.ProfileSvg,
    tone: "success",
    hint: "Completed deliveries",
  },
];

const getInitials = (value) => {
  const text = String(value || "").trim();
  if (!text) return "NA";
  const parts = text.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] || ""}${parts[1][0] || ""}`.toUpperCase();
};

const PhysicalCardOrders = () => {
  const dt = useRef(null);
  const [loader, setLoader] = useState(true);
  const [cardData, setCardData] = useState([]);
  const [detailRecord, setDetailRecord] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [cardTableLoading, setCardTableLoading] = useState(true);
  const [cardSummaryData, setCardSummaryData] = useState({});
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
    url: "tevau/physical-card-orders",
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
      if (activeFilters.status)
        params.append("delivery_status", activeFilters.status);
      if (activeFilters.order) params.append("sort_order", activeFilters.order);

      const res = await request({
        url: `${filterConfig.url}?${params.toString()}`,
        method: "GET",
      });
      const payload = res?.data?.data ?? [];
      const meta = res.data;
      setCardData(payload);
      setCardSummaryData(res.counts ?? {});
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

  const deliveredCount = cardSummaryData.delivered ?? 0;
  const totalCount = cardSummaryData.total ?? 0;
  const deliveryRate = totalCount
    ? Math.round((deliveredCount / totalCount) * 100)
    : 0;

  const actionTemplate = (rowData) => (
    <button
      type="button"
      className="nova-table-action-btn"
      onClick={() => {
        setDetailRecord(rowData);
        setDetailOpen(true);
      }}
      title="View order details"
    >
      <i className="pi pi-eye" />
    </button>
  );

  const statusTemplate = (rowData) => {
    const label = normalizeStatusLabel(rowData.delivery_status);
    return <Tag value={label} severity={getStatusSeverity(label)} />;
  };

  const userTemplate = (rowData) => {
    const name = getFullName(rowData);
    const email = getEmail(rowData);

    return (
      <div className="nova-table-user-cell">
        <div className="nova-table-avatar">{getInitials(name)}</div>
        <div>
          <div className="fw-semibold">{name}</div>
          <div className="text-muted small">{email}</div>
        </div>
      </div>
    );
  };

  const locationTemplate = (rowData) => (
    <div>
      <div className="fw-semibold">{getCityName(rowData)}</div>
      <div className="text-muted small">{getCountryName(rowData)}</div>
    </div>
  );

  const exportCSV = () => dt.current?.exportCSV();

  const renderHeader = () => (
    <div className="nova-table-toolbar">
      <div>
        <h4 className="mb-1">Physical Card Orders</h4>
        <p className="text-muted mb-0">
          Track fulfillment, delivery status, and shipping details.
        </p>
      </div>

      <TableFilters
        filterConfig={filterConfig}
        onFilterChange={(updatedFilters) => setFilters(updatedFilters)}
        statusOptions={PHYSICAL_CARD_STATUS}
        orderOptions={ORDER_OPTIONS}
        exportCSV={exportCSV}
      />
    </div>
  );

  const updateDeliveryStatus = async (cardId, newStatus) => {
    try {
      setCardData((prev) =>
        prev.map((item) =>
          item.id === cardId ? { ...item, delivery_status: newStatus } : item,
        ),
      );

      await request({
        url: `tevau/physical-card-orders/${cardId}/delivery-status`,
        method: "POST",
        data: { delivery_status: newStatus },
      });

      Swal.fire({
        icon: "success",
        title: "Status Updated Successfully",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed to update status",
      });
    }
  };

  const deliveryStatusTemplate = (rowData) => {
    const currentStatus = rowData.delivery_status;
    const filteredStatuses = PHYSICAL_CARD_STATUS.filter((status) => {
      if (currentStatus === "processing") return status.value !== "pending";
      if (currentStatus === "shipped") {
        return status.value !== "pending" && status.value !== "processing";
      }
      if (currentStatus === "delivered") return status.value === "delivered";
      return true;
    });

    return (
      <select
        className="form-select form-select-sm nova-delivery-select"
        value={currentStatus}
        disabled={currentStatus === "delivered"}
        onChange={(e) => updateDeliveryStatus(rowData.id, e.target.value)}
      >
        {filteredStatuses.map((status) => (
          <option key={status.value} value={status.value}>
            {status.label}
          </option>
        ))}
      </select>
    );
  };

  const emptyMessage = loader ? (
    <div className="nova-table-empty-state">
      <Loading />
      <p>Loading card orders...</p>
    </div>
  ) : (
    <div className="nova-table-empty-state">
      <i className="pi pi-inbox" />
      <h6>No card orders found</h6>
      <p>Try adjusting your search or filters.</p>
    </div>
  );

  const detailFields = detailRecord
    ? [
        { label: "Order ID", value: getDisplayValue(detailRecord.order_reference) },
        { label: "Card Type", value: "Physical" },
        {
          label: "Status",
          value: normalizeStatusLabel(detailRecord.delivery_status),
        },
        { label: "Email", value: getEmail(detailRecord) },
        { label: "Name", value: getFullName(detailRecord) },
        { label: "Phone Number", value: getPhoneNumber(detailRecord) },
        { label: "Country", value: getCountryName(detailRecord) },
        { label: "Address", value: getFullAddress(detailRecord) },
        {
          label: "Created At",
          value: formatDateTime(detailRecord.created_at),
        },
      ]
    : [];

  return (
    <>
      <PageTitle motherMenu="Cards" activeMenu="Physical Card Orders" />

      <div className="nova-page-hero is-orders mb-3">
        <div className="nova-page-hero-copy">
          <span className="nova-page-hero-eyebrow">Physical Fulfillment</span>
          <h2 className="nova-page-hero-title mb-2">Physical card order pipeline</h2>
          <p className="nova-page-hero-text mb-0">
            Monitor order volume, update delivery stages, and review shipping
            details for every physical card request.
          </p>
        </div>

        <div className="nova-page-hero-metrics">
          <div className="nova-page-hero-metric">
            <span>Total Orders</span>
            <strong>
              {cardTableLoading ? "..." : Number(totalCount).toLocaleString()}
            </strong>
          </div>
          <div className="nova-page-hero-metric">
            <span>Delivered</span>
            <strong>
              {cardTableLoading
                ? "..."
                : Number(deliveredCount).toLocaleString()}
            </strong>
          </div>
          <div className="nova-page-hero-metric is-highlight">
            <span>Delivery Rate</span>
            <strong>{cardTableLoading ? "..." : `${deliveryRate}%`}</strong>
          </div>
        </div>
      </div>

      <div className="row g-2 mb-3">
        {statCards.map((card) => (
          <div className="col-xl col-lg-4 col-md-6" key={card.key}>
            <InsightStatCard
              title={card.title}
              value={
                cardTableLoading ? "..." : (cardSummaryData[card.key] ?? 0)
              }
              icon={card.icon}
              tone={card.tone}
              hint={card.hint}
            />
          </div>
        ))}
      </div>

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
            <Column field="id" header="Order ID" sortable />
            <Column header="Customer" body={userTemplate} sortable />
            <Column
              header="Phone"
              body={(rowData) => getPhoneNumber(rowData)}
              sortable
            />
            <Column header="Location" body={locationTemplate} sortable />
            <Column
              field="delivery_status"
              header="Status"
              body={statusTemplate}
              sortable
            />
            <Column header="Update Status" body={deliveryStatusTemplate} />
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
              <h5 className="modal-title mb-1">Order Details</h5>
              <p className="text-muted small mb-0">
                Physical card fulfillment and customer shipping info.
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
                    {getInitials(getFullName(detailRecord))}
                  </div>
                  <div>
                    <h5 className="mb-1">{getFullName(detailRecord)}</h5>
                    <p className="text-muted mb-2">{getEmail(detailRecord)}</p>
                    <Tag
                      value={normalizeStatusLabel(detailRecord.delivery_status)}
                      severity={getStatusSeverity(
                        normalizeStatusLabel(detailRecord.delivery_status),
                      )}
                    />
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

export default PhysicalCardOrders;
