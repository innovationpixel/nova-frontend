import { useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { request } from "../../../../utils/api";
import { CARD_STATUS, ORDER_OPTIONS } from "../../../constant/ApplicationModel";
import { getDisplayValue } from "../../../../utils";
import TableFilters from "../../../components/utilComponents/TableFilters";
import Loading from "../../../components/utilComponents/Loading";

const getInitials = (value) => {
  const text = String(value || "").trim();
  if (!text) return "NA";
  const parts = text.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] || ""}${parts[1][0] || ""}`.toUpperCase();
};

const InviteTable = ({ setLoadingInviteList, setInviteList }) => {
  const dt = useRef(null);

  const [loader, setLoader] = useState(true);
  const [inviteData, setInviteData] = useState([]);

  const [detailRecord, setDetailRecord] = useState({});
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");

  const [levelRecord, setLevelRecord] = useState(null);
  const [levelOpen, setLevelOpen] = useState(false);
  const [levelUpdating, setLevelUpdating] = useState(false);

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
    url: "referral/users",
  };

  const exportCSV = () => dt.current?.exportCSV();

  const getInviteData = async (page = 1, activeFilters = filters) => {
    setLoader(true);
    setLoadingInviteList?.(true);

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
      const meta = res?.data ?? {};

      setInviteList?.(res?.counts ?? {});
      setInviteData(payload);

      setPagination((prev) => ({
        ...prev,
        total: meta.total ?? 0,
        current_page: meta.current_page ?? page,
        per_page: meta.per_page ?? prev.per_page,
      }));
    } catch (error) {
      console.error(error);
      setInviteList?.({});
    } finally {
      setLoader(false);
      setLoadingInviteList?.(false);
    }
  };

  useEffect(() => {
    setPagination((prev) => ({ ...prev, current_page: 1 }));
    getInviteData(1, filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const fetchInviteDetails = async (userId) => {
    if (!userId) return;

    setDetailLoading(true);
    setDetailError("");

    try {
      const res = await request({
        url: `referral/users/${userId}`,
        method: "GET",
      });
      const data = res?.data || null;
      setDetailRecord(data);
    } catch (e) {
      console.error(e);
      setDetailRecord(null);
      setDetailError("Failed to load invite details.");
    } finally {
      setDetailLoading(false);
    }
  };

  const renderHeader = () => (
    <div className="nova-table-toolbar">
      <div>
        <h4 className="mb-1">Referral Users</h4>
        <p className="text-muted mb-0">
          Track invite codes, referral levels, purchases, and earnings.
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

  const earningsTemplate = (rowData) => (
    <span className="nova-invite-earnings">
      ${Number(rowData?.total_earnings_usd ?? 0).toLocaleString()}
    </span>
  );
  const joinedTemplate = (rowData) =>
    metricTemplate(
      Number(rowData?.total_referred_joined ?? 0).toLocaleString(),
      "pi-users",
    );
  const purchasesTemplate = (rowData) =>
    metricTemplate(
      Number(rowData?.total_purchases_from_referrals ?? 0).toLocaleString(),
      "pi-shopping-cart",
    );
  const levelTemplate = (rowData) => (
    <span className="badge bg-primary-subtle text-primary">
      Level {getDisplayValue(rowData?.referral_level)}
    </span>
  );
  const copyInviteCode = async (code) => {
    if (!code || code === "N/A") return;
    try {
      await navigator.clipboard.writeText(String(code));
    } catch (error) {
      console.error(error);
    }
  };

  const codeTemplate = (rowData) => {
    const code = getDisplayValue(rowData?.invitation_code);
    return (
      <div className="d-flex align-items-center gap-2">
        <span className="nova-invite-code">{code}</span>
        {code !== "N/A" ? (
          <button
            type="button"
            className="nova-invite-copy-btn"
            onClick={() => copyInviteCode(code)}
            title="Copy invite code"
          >
            <i className="pi pi-copy" />
          </button>
        ) : null}
      </div>
    );
  };

  const nameTemplate = (rowData) => {
    const name = getDisplayValue(rowData?.name);
    const email = getDisplayValue(rowData?.email);

    return (
      <div className="nova-invite-user-cell">
        <div className="nova-invite-avatar">{getInitials(name)}</div>
        <div>
          <div className="fw-semibold">{name}</div>
          <div className="text-muted small">{email}</div>
        </div>
      </div>
    );
  };

  const metricTemplate = (value, icon) => (
    <span className="nova-invite-metric-chip">
      <i className={`pi ${icon}`} />
      {value}
    </span>
  );
  const canUpdateLevel = (rowData) => Number(rowData?.referral_level) !== 2;

  const openUpdateLevel = (rowData) => {
    setLevelRecord(rowData);
    setLevelOpen(true);
  };

  const confirmUpdateLevel = async () => {
    if (!levelRecord?.user_id) return;

    setLevelUpdating(true);
    try {
      const formData = new FormData();
      formData.append("level", 2);

      await request({
        url: `referral/users/${levelRecord.user_id}/level`,
        method: "POST",
        data: formData,
      });

      setLevelOpen(false);
      setLevelRecord(null);

      await getInviteData(pagination.current_page, filters);
      if (detailOpen && detailRecord?.user_id === levelRecord?.user_id) {
        await fetchInviteDetails(levelRecord.user_id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLevelUpdating(false);
    }
  };

  const openDetails = async (rowData) => {
    const userId = rowData?.user_id;
    setDetailOpen(true);

    // show something immediately (optional)
    setDetailRecord({});
    setDetailError("");

    await fetchInviteDetails(userId);
  };

  const closeDetails = () => {
    setDetailOpen(false);
    setDetailRecord({});
    setDetailLoading(false);
    setDetailError("");
  };

  const actionTemplate = (rowData) => (
    <div className="nova-invite-actions">
      {canUpdateLevel(rowData) ? (
        <button
          type="button"
          className="nova-invite-action-btn"
          onClick={() => openUpdateLevel(rowData)}
        >
          <i className="pi pi-arrow-up-right" />
          Upgrade
        </button>
      ) : (
        <span className="nova-invite-action-muted">Max level</span>
      )}

      <button
        type="button"
        className="nova-invite-action-btn is-icon"
        onClick={() => openDetails(rowData)}
        title="View details"
      >
        <i className="pi pi-eye" />
      </button>
    </div>
  );

  const renderRewardsByLevel = (record) => {
    const rewards = record?.rewards_by_level || {};
    const levels = Object.keys(rewards);

    if (!levels.length) return <div className="text-muted">No rewards data.</div>;

    return (
      <div className="nova-invite-tier-grid">
        {levels.map((lvl) => {
          const r = rewards[lvl] || {};
          return (
            <div className="nova-invite-level-card" key={lvl}>
              <div className="fw-semibold mb-2">Level {lvl}</div>
              <div className="row g-2">
                <div className="col-6">
                  <div className="nova-invite-metric is-physical">
                    <span>Physical</span>
                    <strong>${Number(r?.PHYSICAL ?? 0).toLocaleString()}</strong>
                  </div>
                </div>
                <div className="col-6">
                  <div className="nova-invite-metric is-virtual">
                    <span>Virtual</span>
                    <strong>${Number(r?.VIRTUAL ?? 0).toLocaleString()}</strong>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderRewardsTable = (record) => {
    const rows = Array.isArray(record?.rewards_table) ? record.rewards_table : [];
    if (!rows.length) return <div className="text-muted">No rewards table.</div>;

    return (
      <div className="table-responsive nova-invite-rewards-table-wrap">
        <table className="table table-sm align-middle mb-0 nova-invite-rewards-table">
          <thead>
            <tr>
              <th style={{ width: 100 }}>Level</th>
              <th style={{ width: 160 }}>Card Type</th>
              <th>Amount (USD)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, idx) => (
              <tr key={`${r.level}-${r.card_type}-${idx}`}>
                <td className="fw-semibold">{getDisplayValue(r.level)}</td>
                <td>
                  <span className="badge bg-light text-dark border">
                    {getDisplayValue(r.card_type)}
                  </span>
                </td>
                <td className="fw-semibold">
                  ${Number(r.amount_usd ?? 0).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const detailFields = [
    { label: "User ID", value: getDisplayValue(detailRecord.user_id) },
    { label: "Email", value: getDisplayValue(detailRecord.email) },
    { label: "Invite Code", value: getDisplayValue(detailRecord.invitation_code) },
    { label: "Referral Level", value: getDisplayValue(detailRecord.referral_level) },
    {
      label: "Referred Joined",
      value: Number(detailRecord.total_referred_joined ?? 0).toLocaleString(),
    },
    {
      label: "Referral Purchases",
      value: Number(detailRecord.total_purchases_from_referrals ?? 0).toLocaleString(),
    },
    {
      label: "Total Earnings (USD)",
      value: `$${Number(detailRecord.total_earnings_usd ?? 0).toLocaleString()}`,
    },
  ];

  const emptyMessage = loader ? (
    <div className="nova-invite-empty-state">
      <Loading />
      <p>Loading referral users...</p>
    </div>
  ) : (
    <div className="nova-invite-empty-state">
      <i className="pi pi-inbox" />
      <h6>No referral users found</h6>
      <p>Try adjusting your search or filters.</p>
    </div>
  );

  return (
    <>
      <div className="card nova-panel nova-invite-table-panel">
        <div className="card-body">
          <DataTable
            value={inviteData}
            loading={loader}
            className="p-datatable-sm nova-table nova-invite-table"
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
              getInviteData(nextPage, filters);
            }}
          >
            <Column field="user_id" header="User ID" sortable />
            <Column header="User" body={nameTemplate} sortable />
            <Column header="Invite Code" body={codeTemplate} sortable />
            <Column header="Level" body={levelTemplate} sortable />

            <Column
              field="total_referred_joined"
              header="Referred Joined"
              body={joinedTemplate}
              sortable
            />
            <Column
              field="total_purchases_from_referrals"
              header="Referral Purchases"
              body={purchasesTemplate}
              sortable
            />
            <Column
              field="total_earnings_usd"
              header="Earnings (USD)"
              body={earningsTemplate}
              sortable
            />
            <Column header="Action" body={actionTemplate} />
          </DataTable>
        </div>
      </div>

      <Modal
        show={levelOpen}
        onHide={() => setLevelOpen(false)}
        centered
        className="nova-invite-modal"
      >
        <div className="modal-content">
          <div className="modal-header border-0 pb-0">
            <h5 className="modal-title">Update Referral Level</h5>
            <button
              type="button"
              className="btn-close"
              onClick={() => setLevelOpen(false)}
            />
          </div>

          <div className="modal-body">
            {levelRecord ? (
              <>
                <div className="nova-invite-level-card mb-3">
                  <div className="text-muted small mb-1">User</div>
                  <div className="fw-semibold">
                    {getDisplayValue(levelRecord.email)}
                  </div>
                </div>

                <div className="nova-profile-list">
                  <div className="nova-profile-list-row">
                    <span>Current Level</span>
                    <strong>{getDisplayValue(levelRecord.referral_level)}</strong>
                  </div>
                  <div className="nova-profile-list-row">
                    <span>New Level</span>
                    <strong>2</strong>
                  </div>
                </div>

                <p className="text-muted small mt-3 mb-0">
                  This action will upgrade the user&apos;s referral level to 2.
                </p>
              </>
            ) : (
              <div className="text-muted">No user selected.</div>
            )}
          </div>

          <div className="modal-footer">
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => setLevelOpen(false)}
              disabled={levelUpdating}
            >
              Cancel
            </button>

            <button
              className="btn btn-primary btn-sm"
              onClick={confirmUpdateLevel}
              disabled={levelUpdating || !levelRecord}
            >
              {levelUpdating ? "Updating..." : "Update to Level 2"}
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        show={detailOpen}
        onHide={closeDetails}
        centered
        size="lg"
        className="nova-invite-modal"
      >
        <div className="modal-content">
          <div className="modal-header border-0 pb-0">
            <div>
              <h5 className="modal-title mb-1">Invite Details</h5>
              <p className="text-muted small mb-0">
                Referral summary, rewards by level, and payout breakdown.
              </p>
            </div>
            <button type="button" className="btn-close" onClick={closeDetails} />
          </div>

          <div className="modal-body pt-0">
            {detailLoading ? (
              <div className="nova-invite-empty-state compact">
                <Loading />
                <p>Loading invite details...</p>
              </div>
            ) : detailError ? (
              <div className="alert alert-danger mb-0">{detailError}</div>
            ) : detailRecord ? (
              <>
                <div className="nova-invite-detail-hero">
                  <div className="nova-invite-avatar is-large">
                    {getInitials(detailRecord.name || detailRecord.email)}
                  </div>
                  <div>
                    <h5 className="mb-1">
                      {getDisplayValue(detailRecord.name || detailRecord.email)}
                    </h5>
                    <p className="text-muted mb-2">
                      {getDisplayValue(detailRecord.email)}
                    </p>
                    <div className="d-flex flex-wrap gap-2">
                      <span className="nova-invite-code">
                        {getDisplayValue(detailRecord.invitation_code)}
                      </span>
                      <span className="badge bg-primary-subtle text-primary">
                        Level {getDisplayValue(detailRecord.referral_level)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="row g-3 mb-4">
                  <div className="col-md-4">
                    <div className="nova-invite-detail-stat">
                      <span>Referred Joined</span>
                      <strong>
                        {Number(
                          detailRecord.total_referred_joined ?? 0,
                        ).toLocaleString()}
                      </strong>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="nova-invite-detail-stat">
                      <span>Referral Purchases</span>
                      <strong>
                        {Number(
                          detailRecord.total_purchases_from_referrals ?? 0,
                        ).toLocaleString()}
                      </strong>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="nova-invite-detail-stat is-earnings">
                      <span>Total Earnings</span>
                      <strong>
                        ${Number(detailRecord.total_earnings_usd ?? 0).toLocaleString()}
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

                <div className="mb-4">
                  <h6 className="mb-1">Rewards By Level</h6>
                  <p className="text-muted small mb-3">
                    Physical and virtual reward totals per referral level.
                  </p>
                  {renderRewardsByLevel(detailRecord)}
                </div>

                <div>
                  <h6 className="mb-1">Rewards Table</h6>
                  <p className="text-muted small mb-3">
                    Full payout matrix by level and card type.
                  </p>
                  {renderRewardsTable(detailRecord)}
                </div>
              </>
            ) : (
              <div className="text-muted">No record selected.</div>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default InviteTable;
