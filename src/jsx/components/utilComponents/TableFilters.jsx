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
    </>
  );
};

export default TableFilters;
