import { useEffect, useRef, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";

const TableFilters = ({
  filterConfig,
  onFilterChange,
  statusOptions = [],
  orderOptions = [],
  exportCSV,
}) => {
  const {
    showSearch = false,
    showStatus = false,
    showOrderFilter = false,
  } = filterConfig;

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(null);
  const [order, setOrder] = useState("desc");
  const onFilterChangeRef = useRef(onFilterChange);

  useEffect(() => {
    onFilterChangeRef.current = onFilterChange;
  }, [onFilterChange]);

  useEffect(() => {
    const delay = setTimeout(() => {
      onFilterChangeRef.current({ search, status, order });
    }, 400);

    return () => clearTimeout(delay);
  }, [search, status, order]);
  const clearFilters = () => {
    setSearch("");
    setStatus(null);
    setOrder("desc");

    onFilterChange({
      search: "",
      status: null,
      order: "desc",
    });
  };

  return (
    <>
      <div className="nova-filter-bar">
        {showSearch && (
          <div className="filter-box">
            <span className="filter-label">Search</span>
            <span className="p-input-icon-left w-100">
              <i className="pi pi-search" />
              <InputText
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="w-100 search-input"
              />
            </span>
          </div>
        )}
        {showStatus && (
          <div className="filter-box">
            <span className="filter-label">Status</span>
            <Dropdown
              value={status}
              options={statusOptions}
              onChange={(e) => setStatus(e.value)}
              placeholder="All Status"
              showClear
              className="w-100"
            />
          </div>
        )}
        {showOrderFilter && (
          <div className="filter-box">
            <span className="filter-label">Sort</span>
            <Dropdown
              value={order}
              options={orderOptions}
              onChange={(e) => setOrder(e.value)}
              placeholder="Sort Order"
              className="w-100"
            />
          </div>
        )}

        <div className="action-buttons">
          <Button
            label="Clear"
            icon="pi pi-refresh"
            className="clear-btn"
            onClick={clearFilters}
          />
          {exportCSV && (
            <Button
              label="Export CSV"
              icon="pi pi-file"
              className="export-btn"
              onClick={exportCSV}
            />
          )}
        </div>
      </div>
      <style>
        {`
          .nova-filter-bar {
            display: flex;
            flex-wrap: wrap;
            gap: 16px;
            align-items: flex-end;
            padding: 16px 18px;
            border-radius: 14px;
            background: #ffffff;
            border: 1px solid #e5e7eb;
            box-shadow: 0px 3px 10px rgba(0,0,0,0.05);
          }

          .filter-box {
            display: flex;
            flex-direction: column;
            gap: 6px;
            min-width: 230px;
          }

          .filter-label {
            font-size: 13px;
            font-weight: 600;
            color: #374151;
          }

          .p-inputtext,
          .p-dropdown {
            height: 44px !important;
            border-radius: 12px !important;
            border: 1px solid #d1d5db !important;
            font-size: 14px !important;
            display: flex;
            align-items: center;
          }

          .search-input {
            padding-left: 42px !important;
          }

          .p-input-icon-left i {
            left: 14px !important;
            font-size: 14px;
            color: #6b7280;
          }

          .action-buttons {
            display: flex;
            gap: 10px;
            margin-top: 22px;
          }

          .export-btn {
            height: 44px !important;
            border-radius: 12px !important;
            font-weight: 600 !important;
            background: #285e7f !important;
            border: none !important;
            color: white !important;
            padding: 0px 18px !important;
          }

          .export-btn:hover {
            background: #1f4c66 !important;
          }

          .clear-btn {
            height: 44px !important;
            border-radius: 12px !important;
            font-weight: 600 !important;
            padding: 0px 18px !important;
            border: 1px solid #dc2626 !important;
            color: #dc2626 !important;
            background: transparent !important;
          }
            .clear-btn .p-button-icon{
            color: #dc2626 !important
            }

            .clear-btn .p-button-label{
            color: #dc2626 !important
            }

            .export-btn .p-button-icon{
            color: white !important
            }

            .export-btn .p-button-label{
            color: white !important
            }

          .p-dropdown-label {
            padding-left: 6px;
          }
        `}
      </style>
    </>
  );
};

export default TableFilters;
