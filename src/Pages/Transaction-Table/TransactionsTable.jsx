import React, { useState, useEffect } from "react";
import { FiEye, FiEdit, FiTrash2 } from "react-icons/fi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CanaraBank from "../../assets/CanaraBank.svg";
import BankOfBarodaLogo from "../../assets/BankOfBarodaLogo.svg";
import { useNavigate } from "react-router-dom";
import { Pagination, Switch, Button, Modal, Input } from "antd";
import stcpay from "../../assets/stcpay.jpg";
import { RiFindReplaceLine } from "react-icons/ri";
import { IoMdCheckmark } from "react-icons/io";
import { FaRegEdit } from "react-icons/fa";
import { GoCircleSlash } from "react-icons/go";

const TransactionsTable = ({ authorization, showSidebar }) => {
  const containerHeight = window.innerHeight - 120;
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [merchant, setMerchant] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [open, setOpen] = React.useState(false);
  const { TextArea } = Input;

  const transactions = [
    {
      id: "9780924782474",
      bankName: "Canara Bank",
      iban: "DE6820050000",
      date: "2024-01-01",
      time: "11:30 AM",
      amount: "₹ 5000",
      UTR: "#893727423434",
      status: "Verified",
    },
    {
      id: "9879827354233",
      bankName: "Bank of Baroda",
      iban: "BM7355353124",
      date: "2024-01-16",
      time: "10:55 AM",
      amount: "₹ 2400",
      UTR: "#893727423434",
      status: "Declined",
    },
    {
      id: "9780924782474",
      bankName: "Canara Bank",
      iban: "DE6820050000",
      date: "2024-01-01",
      time: "11:30 AM",
      amount: "₹ 5000",
      UTR: "#893727423434",
      status: "Verified",
    },
    {
      id: "9879827354233",
      bankName: "Bank of Baroda",
      iban: "BM7355353124",
      date: "2024-01-16",
      time: "10:55 AM",
      amount: "₹ 2400",
      UTR: "#893727423434",
      status: "Declined",
    },
    {
      id: "9780924782474",
      bankName: "Canara Bank",
      iban: "DE6820050000",
      date: "2024-01-01",
      time: "11:30 AM",
      amount: "₹ 5000",
      UTR: "#893727423434",
      status: "Verified",
    },
    {
      id: "9879827354233",
      bankName: "Bank of Baroda",
      iban: "BM7355353124",
      date: "2024-01-16",
      time: "10:55 AM",
      amount: "₹ 2400",
      UTR: "#893727423434",
      status: "Declined",
    },
    {
      id: "9780924782474",
      bankName: "Canara Bank",
      iban: "DE6820050000",
      date: "2024-01-01",
      time: "11:30 AM",
      amount: "₹ 5000",
      UTR: "#893727423434",
      status: "Verified",
    },
    {
      id: "9879827354233",
      bankName: "Bank of Baroda",
      iban: "BM7355353124",
      date: "2024-01-16",
      time: "10:55 AM",
      amount: "₹ 2400",
      UTR: "#893727423434",
      status: "Declined",
    },
    {
      id: "9780924782474",
      bankName: "Canara Bank",
      iban: "DE6820050000",
      date: "2024-01-01",
      time: "11:30 AM",
      amount: "₹ 5000",
      UTR: "#893727423434",
      status: "Verified",
    },
    {
      id: "9879827354233",
      bankName: "Bank of Baroda",
      iban: "BM7355353124",
      date: "2024-01-16",
      time: "10:55 AM",
      amount: "₹ 2400",
      UTR: "#893727423434",
      status: "Declined",
    },
    {
      id: "9780924782474",
      bankName: "Canara Bank",
      iban: "DE6820050000",
      date: "2024-01-01",
      time: "11:30 AM",
      amount: "₹ 5000",
      UTR: "#893727423434",
      status: "Verified",
    },
    {
      id: "9879827354233",
      bankName: "Bank of Baroda",
      iban: "BM7355353124",
      date: "2024-01-16",
      time: "10:55 AM",
      amount: "₹ 2400",
      UTR: "#893727423434",
      status: "Declined",
    },
    {
      id: "9780924782474",
      bankName: "Canara Bank",
      iban: "DE6820050000",
      date: "2024-01-01",
      time: "11:30 AM",
      amount: "₹ 5000",
      UTR: "#893727423434",
      status: "Verified",
    },
  ];

  const bankImages = {
    "Canara Bank": CanaraBank,
    "Bank of Baroda": BankOfBarodaLogo,
  };

  const getStatusClass = (status) => {
    if (status === "Verified")
      return "bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium";
    if (status === "Declined")
      return "bg-red-100 text-red-800 px-3 py-1 rounded-full font-medium";
    return "bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-medium";
  };

  const handleSearch = () => {
    const filtered = transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      const isDateInRange =
        (!startDate || transactionDate >= startDate) &&
        (!endDate || transactionDate <= endDate);

      const isMerchantMatch =
        !merchant || transaction.merchantName === merchant;

      const isSearchMatch =
        !searchQuery ||
        transaction.merchantName
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      return isDateInRange && isMerchantMatch && isSearchMatch;
    });
    setFilteredTransactions(filtered);
  };

  // Run search whenever criteria change
  useEffect(() => {
    handleSearch();
  }, [startDate, endDate, merchant, searchQuery]);

  useEffect(() => {
    window.scroll(0, 0);
    if(!authorization)
      navigate("/login")
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
          <h1 className="text-[25px] font-[500]">All Transaction</h1>
          <p className="text-[#7987A1] text-[13px] md:text-[15px] font-[400]">
            Dashboard - Data Table
          </p>
        </div>
        <div className="bg-white rounded-lg p-4">
          <div className="flex flex-col md:flex-row items-center justify-between pb-3">
            <div>
              <p className="text-black font-medium text-lg">
                List of all Transactions
              </p>
            </div>
            <Button type="primary" onClick={() => setOpen(true)}>
              Transaction Details
            </Button>

            <Modal
              centered
              footer={null}
              width={900}
              style={{ fontFamily: "sans-serif", padding: "20px" }}
              title={
                <p className="text-[16px] font-[700]">Transaction Details</p>
              }
              open={open}
              onCancel={() => setOpen(false)}
              onClose={() => setOpen(false)}
            >
              <div className="flex flex-col md:flex-row">
                {/* Left side input fields */}
                <div className="flex flex-col gap-2 mt-3 w-full md:w-1/2">
                  {/* Repeated field structure for inputs */}
                  {[
                    { label: "Amount:", placeholder: "₹ 5000" },
                    { label: "Account Holder:", placeholder: "Sorav Gopta" },
                    { label: "UTR#:", placeholder: "#323032038826" },
                    { label: "IBAN#:", placeholder: "COB94750934876767" },
                    {
                      label: "Date & Time:",
                      placeholder: "01 Jan 2024, 11:30 AM",
                    },
                    {
                      label: "Bank Name:",
                      options: [
                        "Select a bank",
                        "Bank of Baroda",
                        "State Bank of India",
                        "HDFC Bank",
                        "Axis Bank",
                        "ICICI Bank",
                      ],
                    },
                    {
                      label: "Description:",
                      placeholder:
                        "IMPS-426713610684-EMIRATES NBD BANK MUMB AI-EBIL-XXXXXXXXXXX0005-REMITTANCE FROM INDIAN NON-RESIDENC",
                      isTextarea: true,
                    },
                  ].map((field, index) => (
                    <div className="flex items-center gap-4" key={index}>
                      <p className="text-[12px] font-[600] w-[150px]">
                        {field.label}
                      </p>
                      {field.options ? (
                        <select className="w-[50%] text-[12px] border outline-none rounded p-1 input-placeholder-black">
                          {field.options.map((option, idx) => (
                            <option key={idx} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      ) : field.isTextarea ? (
                        <textarea
                          className="w-[50%] text-[11px] border rounded p-1 resize-none outline-none input-placeholder-black overflow-hidden"
                          placeholder={field.placeholder}
                          rows={3}
                          style={{ overflow: "auto", resize: "none" }}
                        />
                      ) : (
                        <Input
                          className="w-[50%] text-[12px] input-placeholder-black"
                          placeholder={field.placeholder}
                        />
                      )}
                    </div>
                  ))}
                  <div className="flex gap-2 mt-4">
                    <button className="bg-[#03996933] flex text-[#039969] px-3 py-1  rounded hover:bg-[#03996950] text-[10px] ">
                      <IoMdCheckmark className="mt-[3px] mr-[6px]" /> Approve
                      Transaction
                    </button>
                    <button className="bg-[#FF405F33] flex text-[#FF3F5F] px-4  py-1 rounded hover:bg-[#FF405F50] text-[10px] ">
                      <GoCircleSlash className="mt-[3px] mr-[6px]" />
                      Decline TR
                    </button>
                    <button className="bg-[#F6790233] flex text-[#F67A03] px-4 ml-[40px] py-1 rounded hover:bg-[#F6790250] text-[10px] ">
                      <FaRegEdit className="mt-[2px] mr-2" /> Edit TR
                    </button>
                  </div>

                  {/* Bottom Divider and Activity */}
                  <div className="border-b w-[370px] mt-4"></div>
                  <p className="text-[12px] font-[600]">Activity</p>
                  <p className="text-[9px] font-[600] leading-10">
                    Transaction ID:{" "}
                    <span className="text-[9px] font-[600] text-[#00000080]">
                      98714987971982
                    </span>
                  </p>
                </div>

                {/* Right side with border and image */}
                <div className="w-full md:w-1/2 md:border-l my-10 md:mt-0 pl-0 md:pl-6 flex flex-col justify-between items-center h-full">
                  {/* Image */}
                  <img
                    src={stcpay}
                    alt="Payment Image"
                    className="max-h-full"
                  />

                  {/* Button */}
                  <div className="flex">
                    <button className="mt-4 border flex border-black px-1 py-1 rounded ">
                      <RiFindReplaceLine className="mt-[5px] mr-2 text-[#699BF7]" />
                      <p>Replace Payment Proof</p>
                    </button>
                  </div>
                </div>
              </div>
            </Modal>

            <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
              <div className="flex border border-gray-300 items-center bg-white rounded">
                {/* 2px border radius */}
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  className="border-none text-[11px] pl-1 p-1  w-14 text-gray-700 focus:outline-none rounded-l" // 2px rounded left side
                  placeholderText="Start Date"
                  dateFormat="yyyy-MM-dd"
                />
                <span className="mt-[4px] text-[11px] font-[600] mr-1">To</span>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                  className="border-none text-[11px] w-12  text-gray-700 focus:outline-none rounded-r" // 2px rounded right side
                  placeholderText="End Date"
                  dateFormat="yyyy-MM-dd"
                />
              </div>
              <div className="flex flex-col w-full md:w-40">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border w-full border-gray-300 rounded py-1 text-[12px] pl-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div className="flex flex-col w-full md:w-40">
                <select
                  value={merchant}
                  onChange={(e) => setMerchant(e.target.value)}
                  className="border border-gray-300 rounded py-1 text-[12px] text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option className="text-[10px] text-gray-400" value="">
                    Merchant
                  </option>
                  <option
                    className="text-[10px] text-gray-400"
                    value="Shubh Exchange"
                  >
                    Shubh Exchange
                  </option>
                  <option
                    className="text-[10px] text-gray-400"
                    value="Book Fair"
                  >
                    Book Fair
                  </option>
                </select>
              </div>
            </div>
          </div>
          <div className="w-full border-t-[1px] border-[#DDDDDD80] hidden sm:block mb-4"></div>
          <div className="overflow-x-auto">
            <table className="min-w-full border">
              <thead>
                <tr className="bg-[#ECF0FA] text-left text-[12px] text-gray-700">
                  <th className="p-4">TRN-ID</th>
                  <th className="p-4">BANK NAME</th>
                  <th className="p-4">IBAN</th>
                  <th className="p-4">DATE</th>
                  <th className="p-4">AMOUNT</th>
                  <th className="p-4">UTR#</th>
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
                      <td className="p-4 text-[11px] font-[600] text-[#000000B2]">
                        {transaction.id}
                      </td>
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
                        {transaction.iban}
                      </td>
                      <td className="p-4 text-[11px] font-[600] text-[#000000B2] whitespace-nowrap">
                        {transaction.date}
                      </td>

                      <td className="p-4 text-[11px] font-[700] text-[#000000B2]">
                        {transaction.amount}
                      </td>
                      <td className="p-4 text-[11px] font-[700] text-[#0864E8]">
                        {transaction.UTR}
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
                          className="bg-green-100 text-green-600 rounded-full px-2 py-2 mx-2"
                          title="Edit"
                        >
                          <FiEdit />
                        </button>
                        <button
                          className="bg-red-100 text-red-600 rounded-full px-2 py-2 mx-2"
                          title="Delete"
                        >
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="p-4 text-center text-gray-500">
                      No transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex flex-col md:flex-row items-center p-4 justify-between space-y-4 md:space-y-0">
            <p className="text-[13px] font-[500] text-gray-500 text-center md:text-left">
              Showing 1 to 10 of 17 entries
            </p>
            <Pagination
              className="self-center md:self-auto"
              onChange={() => navigate("")}
              defaultCurrent={1}
              total={50}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionsTable;
