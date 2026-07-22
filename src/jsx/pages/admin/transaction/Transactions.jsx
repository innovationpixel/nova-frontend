import React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { filterByDatePreset } from "../../../../utils/novaDateUtils";
import { SVGICON } from "../../../constant/theme";
import { getStatusSeverity } from "../components/statusUtils";
import { adminMetrics, transactions } from "../../../data/adminData";
import StatCard from "../components/StatCard";
import PageTitle from "../../../layouts/PageTitle";

const Transactions = () => {
  const [globalFilterValue, setGlobalFilterValue] = React.useState("");
  const [datePreset, setDatePreset] = React.useState("monthly");
  const [dateRange, setDateRange] = React.useState(null);

  const filteredTransactions = React.useMemo(
    () => filterByDatePreset(transactions, "date", datePreset, dateRange),
    [datePreset, dateRange],
  );

  const statusTemplate = (rowData) => (
    <Tag value={rowData.status} severity={getStatusSeverity(rowData.status)} />
  );

  return (
    <>
      <PageTitle motherMenu="Transactions" activeMenu="Transactions" />
      <div className="row g-3 mb-3">
        <div className="col-md-6">
          <StatCard
            title="Today Transactions"
            value={adminMetrics.todayTransactions}
            icon={SVGICON.DollerSvg}
            color="primary"
            subtitle={`$ ${adminMetrics.todayAmount.toLocaleString()}`}
          />
        </div>
        <div className="col-md-6">
          <StatCard
            title="Total Transactions"
            value={adminMetrics.totalTransactions}
            icon={SVGICON.GroupCoin}
            color="secondary"
            subtitle={`$ ${adminMetrics.totalAmount.toLocaleString()}`}
          />
        </div>
      </div>
      <div className="card nova-panel">
        <div className="card-body">
          <DataTable
            value={filteredTransactions}
            paginator
            rows={8}
            className="p-datatable-sm nova-table"
            globalFilter={globalFilterValue}
            globalFilterFields={["id", "user", "type", "status", "channel"]}
            header={
              <div className="nova-table-toolbar">
                <div>
                  <h4 className="mb-0">All Transactions</h4>
                  <span className="text-muted">Track daily card activity</span>
                </div>
                <div className="nova-table-filters">
                  <span className="p-input-icon-left nova-input">
                    <i className="pi pi-search" />
                    <InputText
                      value={globalFilterValue}
                      onChange={(e) => setGlobalFilterValue(e.target.value)}
                      placeholder="Search transactions"
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
            <Column field="id" header="Txn ID" sortable />
            <Column field="user" header="User" />
            <Column field="type" header="Type" />
            <Column field="channel" header="Channel" />
            <Column field="amount" header="Amount (PKR)" sortable />
            <Column field="date" header="Date" sortable />
            <Column field="status" header="Status" body={statusTemplate} />
          </DataTable>
        </div>
      </div>
    </>
  );
};

export default Transactions;
