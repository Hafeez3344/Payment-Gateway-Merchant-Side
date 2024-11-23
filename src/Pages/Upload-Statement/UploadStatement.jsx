import React, { useState, useEffect } from "react";
import { FiEye, FiEdit, FiTrash2 } from "react-icons/fi";
import { GoCircleSlash } from "react-icons/go";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CanaraBank from "../../assets/CanaraBank.svg";
import BankOfBarodaLogo from "../../assets/BankOfBarodaLogo.svg";
import { useNavigate } from "react-router-dom";
import { Input } from "antd";

const UploadStatement = ({ showSidebar }) => {
  const containerHeight = window.innerHeight - 120;
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [bank, setBank] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [open, setOpen] = React.useState(false);
  const { TextArea } = Input;
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    console.log(file);
  };

  const transactions = [
    {
      id: "9780924782474",
      bankName: "Canara Bank",
      date: "2024-01-01",
      time: "11:30 AM",
      noOfTransactions: 5000,
      status: "System",
    },
    {
      id: "9879827354233",
      bankName: "Bank of Baroda",
      date: "2024-01-16",
      time: "10:55 AM",
      noOfTransactions: 3900,
      status: "Manual",
    },
    {
      id: "9780924782474",
      bankName: "Canara Bank",
      date: "2024-01-01",
      time: "11:30 AM",
      noOfTransactions: 4000,
      status: "System",
    },
    {
      id: "9879827354233",
      bankName: "Bank of Baroda",
      date: "2024-01-16",
      time: "10:55 AM",
      noOfTransactions: 3000,
      status: "Manual",
    },
    {
      id: "9780924782474",
      bankName: "Canara Bank",
      date: "2024-01-01",
      time: "11:30 AM",
      noOfTransactions: 5000,
      status: "System",
    },
    {
      id: "9879827354233",
      bankName: "Bank of Baroda",
      date: "2024-01-16",
      time: "10:55 AM",
      noOfTransactions: 2500,
      status: "Manual",
    },
  ];

  const bankImages = {
    "Canara Bank": CanaraBank,
    "Bank of Baroda": BankOfBarodaLogo,
  };

  const getStatusClass = (status) => {
    if (status === "System")
      return "bg-[#10CB0026] text-[#0DA000] px-3 py-1 rounded-full font-medium";
    if (status === "Manual")
      return "bg-[#0864E833] text-[#0864E8] px-3 py-1 rounded-full font-medium";
    return "bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-medium";
  };

  const handleSearch = () => {
    const filtered = transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      const isDateInRange =
        (!startDate || transactionDate >= startDate) &&
        (!endDate || transactionDate <= endDate);

      const isMerchantMatch = !bank || transaction.bankName === bank;

      const isSearchMatch =
        !searchQuery ||
        transaction.bankName.toLowerCase().includes(searchQuery.toLowerCase());
      return isDateInRange && isMerchantMatch && isSearchMatch;
    });
    setFilteredTransactions(filtered);
  };

  // Run search whenever criteria change
  useEffect(() => {
    handleSearch();
  }, [startDate, endDate, bank, searchQuery]);

  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  return (
    <div
      className={`bg-gray-100 transition-all duration-500 ${
        showSidebar ? "pl-0 md:pl-[270px]" : "pl-0"
      }`}
      style={{ minHeight: `${containerHeight}px` }}
    >
      <div className="p-7">
        <div className="flex flex-col md:flex-row gap-[12px] items-center justify-between mb-7">
          <h1 className="text-[25px] font-[500]">Upload Statement</h1>
          <p className="text-[#7987A1] text-[13px] md:text-[15px] font-[400]">
            Dashboard - Data Table
          </p>
        </div>
        <div className="bg-white rounded-lg flex justify-center items-center h-40 p-4">
          <div className="flex flex-col items-center justify-center w-full">
            <p className="text-[18px] font-[600] text-center mb-3">
              Please Upload your Statement Here
            </p>
            <div className="flex items-center mb-2">
              {/* Upload File Button with Label */}
              <label
                htmlFor="file-upload"
                className="bg-blue-500 text-white rounded py-2 px-4 cursor-pointer"
              >
                Choose a file
              </label>

              {/* Hidden file input */}
              <input
                id="file-upload"
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
            <span className="text-[10px] text-[#00000040]">PDF Files Only</span>
          </div>
        </div>

        <div className="flex justify-between mt-4">
          <p className="text-black font-medium text-lg">All Statements</p>
          <div className="flex flex-col md:flex-row items-center justify-between pb-3">
            <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
              <div className="flex border items-center rounded-md">
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  className="border-none px-3 text-[13px] w-24 text-gray-700 focus:outline-none"
                  placeholderText="Start Date"
                  dateFormat="yyyy-MM-dd"
                />
                <span className="py-1 mt-1  text-[12px] font-[600]">To</span>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                  className="border-none px-2 text-[13px] w-24 text-gray-700 focus:outline-none"
                  placeholderText="End Date"
                  dateFormat="yyyy-MM-dd"
                />
              </div>
              <div className="flex flex-col w-full md:w-40">
                <select
                  value={bank}
                  onChange={(e) => setBank(e.target.value)}
                  className="border border-gray-300 rounded py-1 text-[12px] text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option className="text-[10px] text-gray-400" value="">
                    Bank Name
                  </option>
                  <option
                    className="text-[10px] text-gray-400"
                    value="Canara Bank"
                  >
                    Canara Bank
                  </option>
                  <option
                    className="text-[10px] text-gray-400"
                    value="Bank of Baroda"
                  >
                    Bank of Baroda
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-[#ECF0FA] text-left text-[10px] border-2 border-white text-[#000000B2]">
                  <th className="p-4">BANK NAME</th>
                  <th className="p-4">DATE</th>
                  <th className="p-4">NO # of Transaction</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 cursor-pointer">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction) => (
                    <tr
                      key={transaction.id}
                      className="text-gray-800 text-sm border-b"
                    >
                      <td className="p-4 flex items-center">
                        <img
                          src={bankImages[transaction.bankName]}
                          alt={`${transaction.bankName} Logo`}
                          className="w-6 h-6 rounded-full mr-2"
                        />
                        <span className="text-[12px] font-[700] text-black whitespace-nowrap">
                          {transaction.bankName}
                        </span>
                      </td>
                      <td className="p-4 text-[11px] font-[600] text-[#000000B2]">
                        {transaction.date}
                      </td>
                      <td className="p-4 text-[11px] font-[700] text-[#000000B2]">
                        {transaction.noOfTransactions}
                      </td>
                      <td className="p-4 text-[11px] font-[500]">
                        <span className={getStatusClass(transaction.status)}>
                          {transaction.status}
                        </span>
                      </td>
                      <td className="p-4 flex space-x-2">
                        <button
                          className="bg-blue-100 text-blue-600 rounded-full px-2 py-2 mx-2"
                          title="View"
                        >
                          <FiEye />
                        </button>
                        <button
                          className="bg-[#FF173D26] text-[#D50000] rounded-full px-2 py-2 mx-2"
                          title="Edit"
                        >
                          <GoCircleSlash />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-4 text-center text-gray-500">
                      No transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadStatement;
