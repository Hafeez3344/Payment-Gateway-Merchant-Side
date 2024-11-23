import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "antd";
import ReportAnalytic from "../../assets/ReportAnalytic.png";
import userGraph from "../../assets/userGraph.png";
import transactionGraph from "../../assets/transactionGraph.png";
import statasticGraph from "../../assets/statasticGraph.png";

const ReportsAndAnalytics = ({ showSidebar }) => {
  const containerHeight = window.innerHeight - 120;
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [open, setOpen] = useState(false);

  const transactions = [
    {
      id: "9780924782474",
      title: "Payment Issue",
      status: "New Ticket",
      ticketOpen: "01 Jan 2024, 11:30 AM",
      ticketClose: "02 Jan 2024, 03:45 PM",
    },
    {
      id: "9879827354233",
      title: "Refund Request",
      status: "In Progress",
      ticketOpen: "02 Jan 2024, 10:00 AM",
      ticketClose: "02 Jan 2024, 02:15 PM",
    },
    {
      id: "9780924782474",
      title: "Payment Issue",
      status: "Solved",
      ticketOpen: "01 Jan 2024, 11:30 AM",
      ticketClose: "02 Jan 2024, 03:45 PM",
    },
    {
      id: "9879827354233",
      title: "Refund Request",
      status: "In Progress",
      ticketOpen: "02 Jan 2024, 10:00 AM",
      ticketClose: "02 Jan 2024, 02:15 PM",
    },
  ];

  const getStatusClass = (status) => {
    const statusClasses = {
      "New Ticket":
        "bg-[#00000080] text-white px-2  rounded-full text-[11px] font-[500] ",
      "In Progress":
        "bg-[#0864E833] text-[#0864E8] px-2  rounded-full text-[11px] font-[500] ",
      Solved:
        "bg-green-100 text-green-800 px-[18px]  rounded-full text-[11px] font-[500] ",
    };
    return (
      statusClasses[status] ||
      "bg-gray-100 text-gray-800 px-3 py-1 rounded-full font-medium"
    );
  };

  const handleSearch = () => {
    const filtered = transactions.filter((transaction) =>
      transaction.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredTransactions(filtered);
  };

  useEffect(() => {
    handleSearch();
  }, [searchQuery]);

  return (
    <div
      className={`bg-gray-100 transition-all duration-500 ${
        showSidebar ? "pl-0 md:pl-[270px]" : "pl-0"
      }`}
      style={{ minHeight: `${containerHeight}px` }}
    >
      <div className="p-7">
        <div className="flex flex-col md:flex-row gap-[12px] items-center justify-between mb-7">
          <h1 className="text-[25px] font-[500]">Reports and analytics</h1>
          <p className="text-[#7987A1] text-[13px] md:text-[15px] font-[400]">
            Dashboard - Data Table
          </p>
        </div>
        <div className="bg-white rounded-lg p-4">
          <p className="text-[14px] font-[600]">Earning Statistic</p>
          <p className="text-[13px] font-[400]">Yearly earning overview</p>
          <div className="mt-4">
            <img src={ReportAnalytic} alt="" />
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between gap-4 mt-5">
          {/* User Overview Graph */}
          <div className="bg-white rounded-lg shadow-md p-4 flex-1">
            <h3 className="text-lg font-semibold mb-2">User Overview</h3>
            <div className="flex items-center justify-center">
              <img
                src={userGraph}
                alt="User Overview Graph"
                className="max-w-full"
              />
            </div>
            <div className="flex justify-between">
              <p className="text-[11px] font-[700]"><span className="text-[#00000080]">New:</span> 500</p>
              <p className="text-[11px] font-[700]"><span className="text-[#00000080]">Subscribed:</span> 300</p>
            </div>
          </div>

          {/* Total Transactions Graph */}
          <div className="bg-white rounded-lg shadow-md p-4 flex-1">
            <h3 className="text-lg font-semibold mb-2">Total Transactions</h3>
            <p className="text-[12px] font-[600]"><span className="text-[#00000080]">Total Gain: </span>$50,000</p>
            <div>
              <img
                src={transactionGraph}
                alt="Total Transactions Graph"
                className="max-w-full"
              />
            </div>
          </div>

          {/* Statistics Graph */}
          <div className="bg-white rounded-lg shadow-md p-4 flex-1">
            <h3 className="text-lg font-semibold mb-2">Statistics</h3>
            <div className="">
              <img
                src={transactionGraph}
                alt="Total Transactions Graph"
                className="max-w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsAndAnalytics;
