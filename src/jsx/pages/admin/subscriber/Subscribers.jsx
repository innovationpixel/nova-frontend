import React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { SVGICON } from "../../../constant/theme";
import { adminMetrics, cardSubscriptions } from "../../../data/adminData";
import { filterByDatePreset } from "../../../../utils/novaDateUtils";
import { getStatusSeverity } from "../components/statusUtils";
import StatCard from "../components/StatCard";
import PageTitle from "../../../layouts/PageTitle";

const Subscribers = () => {
  const [globalFilterValue, setGlobalFilterValue] = React.useState("");
  const [datePreset, setDatePreset] = React.useState("monthly");
  const [dateRange, setDateRange] = React.useState(null);

  const filteredSubscribers = React.useMemo(
    () => filterByDatePreset(cardSubscriptions, "subscribedAt", datePreset, dateRange),
    [datePreset, dateRange]
  );

  const statusTemplate = (rowData) => (
    <Tag value={rowData.status} severity={getStatusSeverity(rowData.status)} />
  );

  const feeTemplate = (rowData) => `$${rowData.fee}`;

  return (
    <>
      <PageTitle motherMenu="Subscribers" activeMenu="Subscribers" />
      <div className="row g-3 mb-3">
        <div className="col-md-4">
          <StatCard
            title="Total Subscribers"
            value={adminMetrics.totalSubscribers}
            icon={SVGICON.PatientUser}
            color="primary"
          />
        </div>
        <div className="col-md-4">
          <StatCard
            title="Virtual Subscribers"
            value={adminMetrics.virtualSubscribers}
            icon={SVGICON.ArrowGreen}
            color="info"
          />
        </div>
        <div className="col-md-4">
          <StatCard
            title="Physical Subscribers"
            value={adminMetrics.physicalSubscribers}
            icon={SVGICON.ArrowRed}
            color="warning"
          />
        </div>
      </div>
      <div className="card nova-panel">
        <div className="card-body">
          <h4 className="mb-3">Subscriber Listing</h4>
          <DataTable
            value={filteredSubscribers}
            paginator
            rows={8}
            className="p-datatable-sm nova-table"
            globalFilter={globalFilterValue}
            globalFilterFields={["id", "name", "type", "plan", "status"]}
            header={
              <div className="nova-table-toolbar">
                <div>
                  <h4 className="mb-0">Subscriber Listing</h4>
                  <span className="text-muted">Active plan overview</span>
                </div>
                <div className="nova-table-filters">
                  <span className="p-input-icon-left nova-input">
                    <i className="pi pi-search" />
                    <InputText
                      value={globalFilterValue}
                      onChange={(e) => setGlobalFilterValue(e.target.value)}
                      placeholder="Search subscribers"
                    />
                  </span>
                  <Dropdown
                    value={datePreset}
                    onChange={(e) => setDatePreset(e.value)}
                    options={[
                      { label: "All", value: "all" },
                      { label: "Weekly", value: "weekly" },
                      { label: "Monthly", value: "monthly" },
                      { label: "Custom Range", value: "custom" },
                    ]}
                    placeholder="Date Filter"
                    className="nova-dropdown"
                  />
                  <Calendar
                    value={dateRange}
                    onChange={(e) => setDateRange(e.value)}
                    selectionMode="range"
                    readOnlyInput
                    placeholder="Select range"
                    className="nova-calendar"
                    disabled={datePreset !== "custom"}
                  />
                </div>
              </div>
            }
          >
            <Column field="id" header="Subscriber ID" sortable />
            <Column field="name" header="User" />
            <Column field="type" header="Card Type" />
            <Column field="plan" header="Plan" />
            <Column field="fee" header="Fee (USD)" body={feeTemplate} />
            <Column field="subscribedAt" header="Subscribed" />
            <Column field="status" header="Status" body={statusTemplate} />
          </DataTable>
        </div>
      </div>
    </>
  );
};

export default Subscribers;
