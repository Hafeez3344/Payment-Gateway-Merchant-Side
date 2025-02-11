import axios from "axios";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { Pagination, Modal, Input, notification, DatePicker, Space } from "antd";

import { RxCross2 } from "react-icons/rx";
import { FaRegEdit } from "react-icons/fa";
import { IoMdCheckmark } from "react-icons/io";
import { GoCircleSlash } from "react-icons/go";
import { FiEye, FiTrash2 } from "react-icons/fi";
import { RiFindReplaceLine } from "react-icons/ri";
import { FaCheck, FaIndianRupeeSign } from "react-icons/fa6";

import BACKEND_URL, { fn_deleteTransactionApi, fn_getAllDirectPaymentApi, fn_updateTransactionStatusApi } from "../../api/api";

const DirectPaymentPage = ({ setSelectedPage, authorization, showSidebar, permissionsData, loginType }) => {

  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);

  const { RangePicker } = DatePicker;
  const [open, setOpen] = useState(false);
  const status = searchParams.get("status");
  const [isEdit, setIsEdit] = useState(false);
  const [merchant, setMerchant] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const containerHeight = window.innerHeight - 120;
  const [currentPage, setCurrentPage] = useState(1);
  const [showPopup, setShowPopup] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [selectedTrns, setSelectedTrns] = useState(null);
  const [dateRange, setDateRange] = useState([null, null]);
  const [reasonForDecline, setReasonForDecline] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const editablePermission = Object.keys(permissionsData).length > 0 ? permissionsData?.directPayment?.edit : true;

  const fetchTransactions = async (pageNumber) => {
    try {
      const result = await fn_getAllDirectPaymentApi(status || null, pageNumber);
      if (result?.status) {
        if (result?.data?.status === "ok") {
          setTransactions(result?.data?.data);
          setTotalPages(result?.data?.totalPages);
        } else {
          setTransactions([]);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setTransactions([]);
    }
  };

  useEffect(() => {
    window.scroll(0, 0);
    if (!authorization) {
      navigate("/login");
      return;
    }
    setSelectedPage("direct-payment");
  }, []);

  useEffect(() => {
    fetchTransactions(currentPage);
  }, [currentPage]);

  const filteredTransactions = transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.createdAt);

    const adjustedEndDate = dateRange[1] ? new Date(dateRange[1]) : null;
    if (adjustedEndDate) {
      adjustedEndDate.setHours(23, 59, 59, 999);
    }

    const isWithinDateRange =
      (!dateRange[0] || transactionDate >= dateRange[0]) &&
      (!adjustedEndDate || transactionDate <= adjustedEndDate);

    const statusCondition = loginType === "minor" ? (transaction?.status === "Approved" && transaction?.approval === false && (!transaction?.reason || transaction?.reason === "")) : true;

    return (
      transaction?.utr?.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (merchant === "" || transaction?.merchantName === merchant) &&
      isWithinDateRange &&
      statusCondition
    );
  });


  const handleViewTransaction = (transaction) => {
    setSelectedTransaction(transaction);
    setOpen(true);
  };

  const handleTransactionAction = async (action, transactionId) => {
    const response = await fn_updateTransactionStatusApi(transactionId, {
      status: action,
    });
    if (response.status) {
      fetchTransactions(currentPage);
      notification.success({
        message: "Success",
        description: "Transaction Updated!",
        placement: "topRight",
      });
      setIsEdit(false);
      setOpen(false);
    } else {
      setIsEdit(false);
      console.error(`Failed to ${action} transaction:`, response.message);
    }
  };

  const handleEditTransactionAction = async (status, id, amount, utr) => {
    const response = await fn_updateTransactionStatusApi(id, {
      status: status,
      total: parseInt(amount),
      utr: utr,
    });
    if (response.status) {
      fetchTransactions(currentPage);
      notification.success({
        message: "Success",
        description: "Transaction Updated!",
        placement: "topRight",
      });
      setOpen(false);
      setIsEdit(false);
    } else {
      setIsEdit(false);
      console.error(`Failed to ${action} transaction:`, response.message);
    }
  };

  const fn_deleteTransaction = async (id) => {
    const response = await fn_deleteTransactionApi(id);
    if (response?.status) {
      notification.success({
        message: "Success",
        description: "Transaction Deleted!",
        placement: "topRight",
      });
      fetchTransactions(currentPage);
    }
  };

  const fn_checkPoints = async (item) => {
    console.log("item ", item);
    const data = {
      merchantId: item?.merchantId,
      ledgerId: item?._id
    };
    const response = await axios.post(`${BACKEND_URL}/approval/create`, data);
    if (response?.data?.status === "ok") {
      fetchTransactions(currentPage);
      notification.success({
        message: "Updated Successfully",
        description: "Added to Approval Points Table",
        placement: "topRight",
      });
    } else {
      notification.error({
        message: "Failed",
        description: "Failed to add to Approval Points Table",
        placement: "topRight",
      });
    };
  };

  const fn_declinePoints = async (item) => {
    const response = await fn_updateTransactionStatusApi(item?._id, { reason: reasonForDecline });
    if (response?.data?.status === "ok") {
      fetchTransactions(currentPage);
      notification.success({
        message: "Updated Successfully",
        description: "Transaction Updated",
        placement: "topRight",
      });
    } else {
      notification.error({
        message: "Failed",
        description: "Failed",
        placement: "topRight",
      });
    };
  };

  return (
    <>
      <div
        className={`bg-gray-100 transition-all duration-500 ${showSidebar ? "pl-0 md:pl-[270px]" : "pl-0"
          }`}
        style={{ minHeight: `${containerHeight}px` }}
      >
        <div className="p-7">
          <div className="flex flex-col md:flex-row gap-[12px] items-center justify-between mb-7">
            <h1 className="text-[25px] font-[500]">Direct Transactions</h1>
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
              <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
                <Space direction="vertical" size={10}>
                  <RangePicker
                    value={dateRange}
                    onChange={(dates) => {
                      setDateRange(dates);
                    }}
                  />
                </Space>
                {/* Search Input */}
                <div className="flex flex-col w-full md:w-40">
                  <input
                    type="text"
                    placeholder="Search by UTR"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border w-full border-gray-300 rounded py-1.5 text-[12px] pl-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>
            </div>
            <div className="w-full border-t-[1px] border-[#DDDDDD80] hidden sm:block mb-4"></div>
            <div className="overflow-x-auto">
              <table className="min-w-full border">
                <thead>
                  <tr className="bg-[#ECF0FA] text-left text-[12px] text-gray-700">
                    <th className="p-4 text-nowrap">TRN-ID</th>
                    <th className="p-4">DATE</th>
                    <th className="p-4 text-nowrap">User Name</th>
                    <th className="p-4 text-nowrap">Website URL</th>
                    <th className="p-4 text-nowrap">BANK NAME</th>
                    <th className="p-4 text-nowrap">TOTAL AMOUNT</th>
                    <th className="p-4 ">UTR#</th>
                    <th className="pl-8">Status</th>
                    <th className="pl-7 cursor-pointer">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((transaction) => (
                      <tr
                        key={transaction?._id}
                        className="text-gray-800 text-sm border-b"
                      >
                        <td className="p-4 text-[13px] font-[600] text-[#000000B2]">
                          {transaction?.trnNo}
                        </td>
                        <td className="p-4 text-[13px] font-[600] text-[#000000B2] whitespace-nowrap text-nowrap">
                          {new Date(transaction?.createdAt).toDateString()},{" "}
                          {new Date(transaction?.createdAt).toLocaleTimeString()}
                        </td>
                        <td className="p-4 text-[13px] font-[700] text-[#000000B2] text-nowrap">
                          {transaction?.username && transaction?.username !== "" ? transaction?.username : "GUEST"}
                        </td>
                        <td className="p-4 text-[13px] font-[600] text-[#000000B2] text-nowrap">
                          {transaction?.site}
                        </td>
                        <td className="p-4">
                          {transaction?.bankId?.bankName ? (
                            <div className="">
                              <span className="text-[13px] font-[700] text-black whitespace-nowrap">
                                {transaction?.bankId?.bankName}
                              </span>
                            </div>
                          ) : (
                            <div className="">
                              <p className="text-[14px] font-[700] text-black ">
                                UPI
                              </p>
                            </div>
                          )}
                        </td>
                        <td className="p-4 text-[13px] font-[700] text-[#000000B2] text-nowrap">
                          <FaIndianRupeeSign className="inline-block mt-[-1px]" />{" "}
                          {transaction?.total}
                        </td>
                        <td className="p-4 text-[12px] font-[700] text-[#0864E8]">
                          {transaction?.utr}
                        </td>
                        <td className="p-4 text-[13px] font-[500]">
                          <span
                            className={`px-2 py-1 rounded-[20px] text-nowrap text-[11px] font-[600] min-w-20 flex items-center justify-center
                              ${transaction?.status === "Decline" ? "bg-[#FF7A8F33] text-[#FF002A]" : transaction?.status === "Pending" ? "bg-[#FFC70126] text-[#FFB800]" : transaction?.approval === true ? "bg-[#10CB0026] text-[#0DA000]" : (transaction?.reason && transaction?.reason !== "") ? "bg-[#cc7aff33] text-[#9929d5]" : "bg-[#00000026] text-[#5a5a5a]"}`}
                          >
                            {transaction?.status === "Decline" ? "Transaction Decline" : transaction?.status === "Pending" ? "Transaction Pending" : transaction?.approval === true ? "Points Approved" : (transaction?.reason && transaction?.reason !== "") ? "Points Decline" : "Points Pending"}
                          </span>
                        </td>
                        <td className="p-4 flex space-x-2 transaction-view-model">
                          <button
                            className="bg-blue-100 text-blue-600 rounded-full px-2 py-2"
                            title="View"
                            onClick={() => handleViewTransaction(transaction)}
                          >
                            <FiEye />
                          </button>
                          {transaction?.status === "Approved" && loginType === "minor" && (
                            <>
                              <button
                                disabled={transaction?.approval || transaction?.reason && transaction?.reason !== ""}
                                className={`px-2 py-2 rounded-full ${(transaction?.approval || transaction?.reason && transaction?.reason !== "") ? "cursor-not-allowed bg-gray-300" : "cursor-pointer bg-green-300"}`}
                                onClick={() => fn_checkPoints(transaction)}
                              >
                                <FaCheck />
                              </button>
                              <button
                                disabled={transaction?.approval || transaction?.reason && transaction?.reason !== ""}
                                className={`px-2 py-2 rounded-full ${(transaction?.approval || transaction?.reason && transaction?.reason !== "") ? "cursor-not-allowed bg-gray-300" : "cursor-pointer bg-red-300"}`}
                                onClick={() => { setShowPopup(true); setSelectedTrns(transaction) }}
                              >
                                <RxCross2 />
                              </button>
                            </>
                          )}

                          {showPopup && (
                            <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center">
                              <div className="bg-white p-5 rounded-lg shadow-sm w-80">
                                <h3 className="text-lg font-bold mb-4">Select Reason</h3>
                                <div className="space-y-3">
                                  {[
                                    "Game Name Incorrect",
                                    "User ID Incorrect",
                                    "Both UserID and Game Name are Incorrect",
                                  ].map((reason, index) => (
                                    <label
                                      key={index}
                                      onChange={() => setReasonForDecline(reason)}
                                      className="flex items-center space-x-3 bg-gray-200 py-2 px-3 rounded-lg hover:bg-gray-300 cursor-pointer"
                                    >
                                      <input type="radio" name="same" className="w-5 h-5 cursor-pointer" />
                                      <span>{reason}</span>
                                    </label>
                                  ))}
                                </div>
                                <button
                                  className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
                                  onClick={() => { setShowPopup(false); fn_declinePoints(selectedTrns) }}
                                >
                                  Submit
                                </button>
                              </div>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="p-4 text-center text-gray-500">
                        No Transactions found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex flex-col md:flex-row items-center p-4 justify-between space-y-4 md:space-y-0">
              <p className="text-[13px] font-[500] text-gray-500 text-center md:text-left"></p>
              <Pagination
                className="self-center md:self-auto"
                onChange={(e) => setCurrentPage(e)}
                defaultCurrent={1}
                total={totalPages * 10}
              />
            </div>
          </div>
        </div>
      </div>
      <Modal
        centered
        footer={null}
        width={900}
        style={{ fontFamily: "sans-serif", padding: "20px" }}
        title={
          <p className="text-[20px] font-[700]">
            Transaction Details
          </p>
        }
        open={open}
        onCancel={() => {
          setOpen(false);
          setIsEdit(false);
        }}
        onClose={() => {
          setOpen(false);
          setIsEdit(false);
        }}
      >
        {selectedTransaction && (
          <div className="flex flex-col md:flex-row">
            {/* Left side input fields */}
            <div className="flex flex-col gap-2 mt-3 w-full md:w-1/2">
              <p className="font-[500] mt-[-20px] mb-[15px]">Transaction Id: <span className="text-gray-500 font-[700]">{selectedTransaction.trnNo}</span></p>
              {[
                {
                  label: "Website:",
                  value: selectedTransaction?.site || selectedTransaction?.website,
                },
                {
                  label: "Amount:",
                  value: selectedTransaction?.total,
                },
                {
                  label: "UTR#:",
                  value: selectedTransaction?.utr,
                },
                {
                  label: "Date & Time:",
                  value: `${new Date(
                    selectedTransaction.createdAt
                  ).toLocaleString()}`,
                },
                {
                  label: "Bank Name:",
                  value:
                    selectedTransaction.bankId?.bankName ||
                    "UPI",
                },
                {
                  label: "Trn Status:",
                  value:
                    selectedTransaction.status,
                },
                // {
                //   label: "Description:",
                //   value:
                //     selectedTransaction.description || "",
                //   isTextarea: true,
                // },
              ].map((field, index) => (
                <div
                  className="flex items-center gap-4"
                  key={index}
                >
                  <p className="text-[12px] font-[600] w-[150px]">
                    {field.label}
                  </p>
                  {field.isTextarea ? (
                    <textarea
                      className="w-[50%] text-[11px] border rounded p-1 resize-none outline-none input-placeholder-black overflow-hidden"
                      value={field.value}
                      rows={3}
                      readOnly
                      style={{
                        overflow: "auto",
                        resize: "none",
                      }}
                    />
                  ) : (
                    <Input
                      prefix={
                        field.label === "Amount:" ? (
                          <FaIndianRupeeSign className="mt-[2px]" />
                        ) : null
                      }
                      className={`w-[50%] text-[12px] input-placeholder-black ${isEdit &&
                        (field.label === "Amount:" ||
                          field?.label === "UTR#:")
                        ? "bg-white"
                        : "bg-gray-200"
                        }`}
                      readOnly={
                        isEdit &&
                          (field.label === "Amount:" ||
                            field?.label === "UTR#:")
                          ? false
                          : true
                      }
                      value={field?.value}
                      onChange={(e) => {
                        if (field?.label === "Amount:") {
                          setSelectedTransaction((prev) => ({
                            ...prev,
                            total: e.target.value,
                          }));
                        } else {
                          setSelectedTransaction((prev) => ({
                            ...prev,
                            utr: e.target.value,
                          }));
                        }
                      }}
                    />
                  )}
                </div>
              ))}
              <div className="border-b w-[370px] mt-4">
                {loginType === "major" && selectedTransaction?.status === "Approved" && (selectedTransaction?.reason && selectedTransaction?.reason !== "") && !selectedTransaction?.approval && (
                  <button className="bg-[#F6790233] flex text-[#F67A03] h-[35px] items-center mb-[10px] px-[10px] rounded-[5px]">Update Information</button>
                )}
              </div>
              {selectedTransaction?.reason && selectedTransaction?.reason !== "" && (
                <div>
                  <p className="font-[600]">Reason For Decline Points:</p>
                  <p className="font-[400] text-[13px]">{selectedTransaction?.reason}</p>
                </div>
              )}
            </div>
            {/* Right side with border and image */}
            <div className="w-full md:w-1/2 md:border-l my-10 md:mt-0 pl-0 md:pl-6 flex flex-col justify-between items-center h-full">
              <img
                src={`${BACKEND_URL}/${selectedTransaction?.image}`}
                alt="Payment Proof"
                className="max-h-[400px]"
              />

              <div className="flex">
                <button
                  className="mt-12 border flex border-black px-1 py-1 rounded"
                  onClick={() => {
                    const input =
                      document.createElement("input");
                    input.type = "file";
                    input.click();
                  }}
                >
                  <RiFindReplaceLine className="mt-[5px] mr-2 text-[#699BF7]" />
                  <p>Replace Payment Proof</p>
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default DirectPaymentPage;
