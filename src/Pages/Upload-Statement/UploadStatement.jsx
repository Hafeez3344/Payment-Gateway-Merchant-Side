import axios from "axios";
import DatePicker from "react-datepicker";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import React, { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { Pagination, Modal, Input, notification } from "antd";
import { FiUpload } from "react-icons/fi";
import { FiEye, FiTrash2 } from "react-icons/fi";

import BACKEND_URL, {
  fn_compareTransactions,
  fn_deleteTransactionApi,
  fn_getAllMerchantApi,
  fn_updateTransactionStatusApi,
  PDF_READ_URL,
  fn_crateTransactionSlip,
  fn_showTransactionSlipData,
} from "../../api/api";

const UploadStatement = ({ setSelectedPage, authorization, showSidebar }) => {
  const navigate = useNavigate();

  const [bank, setBank] = useState("");
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const containerHeight = window.innerHeight - 120;
  const [currentPage, setCurrentPage] = useState(1);
  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [slipData, setSlipData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (event) => {
    try {
      const fileInput = event.target;
      const file = event.target.files[0];

      if (!file) {
        console.error("No file selected");
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(PDF_READ_URL, formData);
      console.log("api res ", response);
      if (!response?.data?.data) {
        console.error("No transaction data returned from API");
        return;
      }

      const transactions = response.data.data
        .map((item) => {
          if (item?.type === "CR") {
            return {
              date: item?.date || "",
              utr: item?.refNo || "",
              description: item?.description || "",
              total: item?.amount || "",
            };
          } else if (item?.type === "DR") {
            return null;
          } else {
            if (
              item?.deposit !== "" &&
              item?.deposit !== undefined &&
              item?.deposit !== null
            ) {
              return {
                date: item?.date || "",
                utr: item?.refNo || item?.reference_number || "",
                description: item?.description || "",
                total: item?.amount || item?.deposit || "",
              };
            } else if (item?.deposit === "") {
              return null;
            } else {
              if (item?.credit !== "") {
                return {
                  date: item?.date || "",
                  utr: item?.refNo || item?.reference_no || "",
                  description: item?.description || "",
                  total: item?.amount || item?.deposit || item?.credit || "",
                };
              } else if (item?.credit === "") {
                return null;
              } else {
                return {
                  date: item?.date || "",
                  utr: item?.refNo || item?.reference_no || "",
                  description: item?.description || "",
                  total: item?.amount || item?.deposit || item?.credit || "",
                };
              }
            }
          }
        })
        ?.filter((data) => data !== null);

      console.log("Uploaded Transaction Details:", transactions);

      const data = {
        pdfName: file.name,
        data: transactions,
        merchant: Cookies.get("merchantId"),
      };

      const transactionPromises = response?.data?.data?.map(async (item) => {
        item.total = item.deposit;
        await fn_compareTransactions(item);
      });

      await Promise.all(transactionPromises);
      const response2 = await fn_crateTransactionSlip(data);

      if (!response2?.status) {
        return notification.error({
          message: "Error",
          description: response2?.message,
          placement: "topRight",
        });
      }

      fileInput.value = "";
      fetchTransactions(currentPage);

      notification.success({
        message: "Success",
        description: "Transactions Updated!",
        placement: "topRight",
      });
    } catch (error) {
      console.error("Error during file upload:", error);
    }
  };

  const fetchTransactions = async (pageNumber) => {
    try {
      const result = await fn_getAllMerchantApi(null, pageNumber);
      if (result?.status) {
        setTransactions(result?.data?.data || []);
        setTotalPages(result?.data?.totalPages || 1);
      } else {
        setTransactions([]);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setTransactions([]);
    }
  };
  const fetchSlipData = async () => {
    try {
      const result = await fn_showTransactionSlipData();
      // console.log("Result from API:", result);

      if (result.status) {
        setSlipData(result.data || []);
      } else {
        console.error("Failed to fetch slip data:", result.message);
        setSlipData([]);
      }
    } catch (error) {
      console.error("Error fetching slip data:", error);
      setSlipData([]);
    }
  };

  const handleViewTransaction = (transaction) => {
    setSelectedTransaction(transaction);
    setOpen(true);
  };

  const handleTransactionAction = async (action, transactionId) => {
    try {
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
        setOpen(false);
        setIsEdit(false);
      }
    } catch (error) {
      console.error(`Failed to ${action} transaction:`, error);
    }
  };

  const handleEditTransactionAction = async (status, id, amount) => {
    try {
      const response = await fn_updateTransactionStatusApi(id, {
        status,
        total: parseInt(amount, 10),
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
      }
    } catch (error) {
      console.error(`Failed to edit transaction:`, error);
    }
  };

  const fn_deleteTransaction = async (id) => {
    try {
      const response = await fn_deleteTransactionApi(id);
      if (response?.status) {
        notification.success({
          message: "Success",
          description: "Transaction Deleted!",
          placement: "topRight",
        });
        fetchTransactions(currentPage);
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  useEffect(() => {
    if (!authorization) navigate("/login");
    setSelectedPage("upload-statement");
    fetchSlipData();
    fetchTransactions(currentPage);
  }, [authorization, setSelectedPage, currentPage]);

  console.log(selectedTransaction);

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
        </div>
        <div className="bg-white rounded-lg flex justify-center items-center h-40 p-4">
          <div className="flex flex-col items-center justify-center w-full">
            <p className="text-[18px] font-[600] text-center mb-3">
              Please Upload your Statement Here
            </p>
            <div className="flex items-center mb-2">
              <label
                htmlFor="file-upload"
                className="flex items-center bg-blue-500 text-white rounded py-2 px-4 cursor-pointer gap-2"
              >
                <FiUpload />
                Choose a file
              </label>
              <input
                id="file-upload"
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
            <span className="text-[11px] text-[#00000040]">PDF Files Only</span>
          </div>
        </div>
        <div className="flex justify-between my-4">
          <p className="text-black font-medium text-lg">All Statements</p>
        </div>
        <div className="bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full border">
              <thead>
                <tr className="bg-[#ECF0FA] text-left text-[12px] text-gray-700">
                  <th className="p-4">S_ID</th>
                  <th className="p-4">PDF NAME</th>
                  <th className="p-4">DATE</th>
                  <th className="p-4 cursor-pointer">Action</th>
                </tr>
              </thead>
              <tbody>
                {slipData?.length > 0 ? (
                  slipData?.map((transaction, index) => (
                    <tr
                      key={transaction?._id}
                      className="text-gray-800 text-sm border-b"
                    >
                      <td className="p-4 text-[11px] font-[600] text-[#000000B2]">
                        {index + 1}
                      </td>
                      <td className="p-4">
                        <span className="text-[12px] font-[700] text-black whitespace-nowrap">
                          {transaction?.pdfName}
                        </span>
                      </td>
                      <td className="p-4 text-[11px] font-[600] text-[#000000B2] whitespace-nowrap ">
                        {new Date(transaction?.createdAt).toDateString()},
                        {new Date(transaction?.createdAt).toLocaleTimeString()}
                      </td>
                      <td className="p-4 flex space-x-2 transaction-view-model">
                        <button
                          className="bg-blue-100 text-blue-600 rounded-full px-2 py-2 mx-2"
                          title="View"
                          onClick={() => handleViewTransaction(transaction)}
                        >
                          <FiEye />
                        </button>
                        <Modal
                          centered
                          footer={null}
                          width={900}
                          style={{ fontFamily: "sans-serif", padding: "10px" }}
                          title={
                            <p className="text-[20px] font-[600] text-center font-sans">
                              {selectedTransaction?.pdfName} | {""}
                              {new Date(
                                selectedTransaction?.createdAt
                              ).toDateString()}
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
                          <table className="min-w-full border">
                            <thead>
                              <tr className="bg-[#ECF0FA] text-left text-[12px] text-gray-700">
                                <th className="p-4">Date</th>
                                <th className="p-4">UTR</th>
                                <th className="p-4">Total</th>
                                <th className="p-4">Description</th>
                              </tr>
                            </thead>
                            <tbody>
                              {selectedTransaction?.data?.map(
                                (transaction, index) => (
                                  <tr
                                    key={index}
                                    className="text-gray-800 text-sm border-b"
                                  >
                                    <td className="p-4 text-[12px] font-[600] text-[#000000B2]">
                                      {transaction?.date}
                                    </td>
                                    <td className="p-4 text-[12px] font-[600] text-[#000000B2]">
                                      {transaction?.utr}
                                    </td>
                                    <td className="p-4 text-[12px] font-[700] text-[#000000B2]">
                                      {transaction?.total}
                                    </td>
                                    <td className="p-4 text-[12px] font-[600] text-[#000000B2]">
                                      {transaction?.description}
                                    </td>
                                  </tr>
                                )
                              )}
                            </tbody>
                          </table>
                          <span className="text-[15px] font-[600] mt-4 block font-sans">
                            Upload Time: {""}
                            <span className="text-[13px] font-[600] text-gray-600">
                              {new Date(transaction?.createdAt).toDateString()}
                            </span>
                            , {""}
                            <span className="text-[13px] font-[600] text-gray-600">
                              {new Date(
                                transaction?.createdAt
                              ).toLocaleTimeString()}
                            </span>
                          </span>
                        </Modal>

                        <button
                          className="bg-red-100 text-red-600 rounded-full px-2 py-2 mx-2"
                          title="Delete"
                          onClick={() => fn_deleteTransaction(transaction?._id)}
                        >
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="p-4 text-center text-gray-500">
                      No Transaction Slip Uploaded
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
  );
};

export default UploadStatement;
