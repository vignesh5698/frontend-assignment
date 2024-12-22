import "./homepage.css";

import { useEffect, useState } from "react";

import React from "react";
import { getAmountData } from "../api/amount";

function Homepage() {
  const [amountData, setAmountData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });

  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(5);

  useEffect(() => {
    getAmountData().then((response) => {
      setAmountData(response);
      setTableData(response);
    });
  }, []);

  const sortTable = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }

    const sortedData = [...tableData].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === "ascending" ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === "ascending" ? 1 : -1;
      }
      return 0;
    });

    setSortConfig({ key, direction });
    setTableData(sortedData);
    setCurrentPage(1);
  };

  const filterTable = (e) => {
    const text = e.target.value.toLowerCase();
    setFilterText(text);
    const filteredData = amountData.filter(
      (item) =>
        item.sNo.toString().includes(text) ||
        item.amountPledged.toString().includes(text) ||
        item.percentageFunded.toString().includes(text)
    );
    setTableData(filteredData);
    setCurrentPage(1);
  };

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = tableData.slice(indexOfFirstRecord, indexOfLastRecord);

  const totalPages = Math.ceil(tableData.length / recordsPerPage);

  const changePage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="table-container">
      <input
        type="text"
        placeholder="Search..."
        value={filterText}
        onChange={filterTable}
        className="filter-input"
      />

      <table className="custom-table">
        <thead>
          <tr>
            <th onClick={() => sortTable("sNo")}>
              S.No
              {sortConfig.key === "sNo" &&
                (sortConfig.direction === "ascending" ? "↑" : "↓")}
            </th>
            <th onClick={() => sortTable("amountPledged")}>
              Amount Pledged
              {sortConfig.key === "amountPledged" &&
                (sortConfig.direction === "ascending" ? "↑" : "↓")}
            </th>
            <th onClick={() => sortTable("percentageFunded")}>
              Percentage Funded
              {sortConfig.key === "percentageFunded" &&
                (sortConfig.direction === "ascending" ? "↑" : "↓")}
            </th>
          </tr>
        </thead>
        <tbody>
          {currentRecords.map((item) => (
            <tr key={item.sNo}>
              <td>{item.sNo}</td>
              <td>{item.amountPledged}</td>
              <td>{item.percentageFunded}%</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination-controls">
        <button
          onClick={() => changePage(currentPage - 1)}
          disabled={currentPage === 1}>
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => changePage(index + 1)}
            className={currentPage === index + 1 ? "active" : ""}>
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => changePage(currentPage + 1)}
          disabled={currentPage === totalPages}>
          Next
        </button>
      </div>

      <div className="records-per-page">
        <label htmlFor="recordsPerPage">Records per page: </label>
        <select
          id="recordsPerPage"
          value={recordsPerPage}
          onChange={(e) => {
            setRecordsPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}>
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="15">15</option>
        </select>
      </div>
    </div>
  );
}

export default Homepage;
