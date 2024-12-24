import axios from "axios";
import DatePicker from "react-datepicker";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import React, { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { Pagination, Modal, Input, notification } from "antd";

import { FiUpload } from "react-icons/fi";
import { GoCircleSlash } from "react-icons/go";
import { FiEdit, FiEye, FiTrash2 } from "react-icons/fi";

import BACKEND_URL, {
  fn_compareTransactions,
  fn_deleteTransactionApi,
  fn_getAllMerchantApi,
  fn_updateTransactionStatusApi,
  PDF_READ_URL,
  fn_crateTransactionSlip,
  fn_showTransactionSlipData,
} from "../../api/api";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { FaRegEdit } from "react-icons/fa";
import { RiFindReplaceLine } from "react-icons/ri";
import { IoMdCheckmark } from "react-icons/io";

// const UploadStatement = ({ setSelectedPage, authorization, showSidebar }) => {
//   const navigate = useNavigate();

//   const [bank, setBank] = useState("");
//   const [open, setOpen] = useState(false);
//   const [isEdit, setIsEdit] = useState(false);
//   const [endDate, setEndDate] = useState(null);
//   const [totalPages, setTotalPages] = useState(1);
//   const [startDate, setStartDate] = useState(null);
//   const containerHeight = window.innerHeight - 120;
//   const [currentPage, setCurrentPage] = useState(1);
//   const [transactions, setTransactions] = useState([]);
//   const [selectedTransaction, setSelectedTransaction] = useState(null);
//   const [slipData, setSlipData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const handleFileUpload = async (event) => {
//     try {
//       const fileInput = event.target;

//       const file = event.target.files[0];

//       if (!file) {
//         console.error("No file selected or invalid event target");
//         return;
//       }

//       const formData = new FormData();
//       formData.append("file", file);

//       const response = await axios.post(PDF_READ_URL, formData);

//       const data = {
//         pdfName: file.name,
//         data: response?.data?.data,
//         merchant: Cookies.get("merchantId"),
//       };

//       const transactionPromises = response?.data?.data?.map(async (item) => {
//         item.total = item.deposit;
//         await fn_compareTransactions(item);
//       });

//       await Promise.all(transactionPromises);
//       const response2 = await fn_crateTransactionSlip(data);
//       if (!response2?.status) {
//         return notification.error({
//           message: "Error",
//           description: response2?.message,
//           placement: "topRight",
//         });
//       }
//       fileInput.value = "";
//       fetchTransactions(currentPage);
//       notification.success({
//         message: "Success",
//         description: "Transactions Updated!",
//         placement: "topRight",
//       });
//     } catch (error) {
//       console.error("Error during file upload:", error);
//     }
//   };

//   const fetchTransactions = async (pageNumber) => {
//     try {
//       const result = await fn_getAllMerchantApi(null, pageNumber);
//       if (result?.status) {
//         if (result?.data?.status === "ok") {
//           setTransactions(result?.data?.data);
//           setTotalPages(result?.data?.totalPages);
//         } else {
//           setTransactions([]);
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       setTransactions([]);
//     }
//   };

//   useEffect(() => {
//     window.scroll(0, 0);
//     if (!authorization) navigate("/login");
//     setSelectedPage("upload-statement");
//   }, []);

//   const handleViewTransaction = (transaction) => {
//     setSelectedTransaction(transaction);
//     setOpen(true);
//   };

//   const handleTransactionAction = async (action, transactionId) => {
//     const response = await fn_updateTransactionStatusApi(transactionId, {
//       status: action,
//     });
//     if (response.status) {
//       fetchTransactions(currentPage);
//       notification.success({
//         message: "Success",
//         description: "Transaction Updated!",
//         placement: "topRight",
//       });
//       setIsEdit(false);
//       setOpen(false);
//     } else {
//       setIsEdit(false);
//       console.error(`Failed to ${action} transaction:`, response.message);
//     }
//   };

//   const handleEditTransactionAction = async (status, id, amount) => {
//     const response = await fn_updateTransactionStatusApi(id, {
//       status: status,
//       total: parseInt(amount),
//     });
//     if (response.status) {
//       fetchTransactions(currentPage);
//       notification.success({
//         message: "Success",
//         description: "Transaction Updated!",
//         placement: "topRight",
//       });
//       setOpen(false);
//       setIsEdit(false);
//     } else {
//       setIsEdit(false);
//       console.error(`Failed to ${action} transaction:`, response.message);
//     }
//   };

//   const fn_deleteTransaction = async (id) => {
//     const response = await fn_deleteTransactionApi(id);
//     if (response?.status) {
//       notification.success({
//         message: "Success",
//         description: "Transaction Deleted!",
//         placement: "topRight",
//       });
//       fetchTransactions(currentPage);
//     }
//   };
//   const fetchSlipData = async () => {
//     const result = await fn_showTransactionSlipData({ id: "6762b9926a01ca017e50de4b" });
//     if (result.status) {
//         console.log("Data fetched successfully:", result.data);
//     } else {
//         console.error("Error fetching data:", result.message);
//     }
// };

// fetchSlipData();

// useEffect(() => {
//   fetchTransactions(currentPage);
// }, [currentPage]);
// useEffect(() => {
//   const fetchSlipData = async () => {
//       setLoading(true);
//       const result = await fn_showTransactionSlipData();
//       if (result.status) {
//           setSlipData(result.data || []);
//           setError("");
//       } else {
//           setError(result.message || "Failed to fetch data.");
//           setSlipData([]);
//       }
//       setLoading(false);
//   };

//   fetchSlipData();
// }, []);
const UploadStatement = ({ setSelectedPage, authorization, showSidebar }) => {
  const navigate = useNavigate();

  const [bank, setBank] = useState("");
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [endDate, setEndDate] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [startDate, setStartDate] = useState(null);
  const containerHeight = window.innerHeight - 120;
  const [currentPage, setCurrentPage] = useState(1);
  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [slipData, setSlipData] = useState([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState("");

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

      const data = {
        pdfName: file.name,
        data: response?.data?.data,
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
      console.log("Result from API:", result);

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
                        {index+1}
                      </td>
                      <td className="p-4">
                        <span className="text-[12px] font-[700] text-black whitespace-nowrap">
                          {transaction?.pdfName}
                        </span>
                      </td>
                      <td className="p-4 text-[11px] font-[600] text-[#000000B2] whitespace-nowrap">
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
                          style={{ fontFamily: "sans-serif", padding: "20px" }}
                          title={
                            <p className="text-[16px] font-[700]">
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
                                {[
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
                                    label: "Description:",
                                    value:
                                      selectedTransaction.description || "",
                                    isTextarea: true,
                                  },
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
                                        className={`w-[50%] text-[12px] input-placeholder-black ${
                                          isEdit && field.label === "Amount:"
                                            ? "bg-white"
                                            : "bg-gray-200"
                                        }`}
                                        readOnly={
                                          isEdit && field.label === "Amount:"
                                            ? false
                                            : true
                                        }
                                        value={field?.value}
                                        onChange={(e) =>
                                          setSelectedTransaction((prev) => ({
                                            ...prev,
                                            total: e.target.value,
                                          }))
                                        }
                                      />
                                    )}
                                  </div>
                                ))}
                                <div className="flex gap-2 mt-4">
                                  {/* Approve Button */}
                                  <button
                                    className="bg-[#03996933] flex text-[#039969] p-2 rounded hover:bg-[#03996950] text-[13px]"
                                    onClick={() =>
                                      handleTransactionAction(
                                        "Verified",
                                        selectedTransaction?._id
                                      )
                                    }
                                  >
                                    <IoMdCheckmark className="mt-[3px] mr-[6px]" />
                                    Approve Transaction
                                  </button>

                                  {/* Decline Button */}
                                  <button
                                    className="bg-[#FF405F33] flex text-[#FF3F5F] p-2 rounded hover:bg-[#FF405F50] text-[13px]"
                                    onClick={() =>
                                      handleTransactionAction(
                                        "Decline",
                                        selectedTransaction?._id
                                      )
                                    }
                                  >
                                    <GoCircleSlash className="mt-[3px] mr-[6px]" />
                                    Decline TR
                                  </button>

                                  {/* Edit Button */}
                                  <button
                                    className="bg-[#F6790233] flex text-[#F67A03] ml-[20px] p-2 rounded hover:bg-[#F6790250] text-[13px]"
                                    onClick={() => {
                                      if (!isEdit) {
                                        setIsEdit(true);
                                      } else {
                                        handleEditTransactionAction(
                                          "Manual Verified",
                                          selectedTransaction._id,
                                          selectedTransaction?.total
                                        );
                                      }
                                    }}
                                  >
                                    {!isEdit ? (
                                      <>
                                        <FaRegEdit className="mt-[2px] mr-2" />{" "}
                                        Edit TR
                                      </>
                                    ) : (
                                      <>
                                        <FaRegEdit className="mt-[2px] mr-2" />{" "}
                                        Update TR
                                      </>
                                    )}
                                  </button>
                                </div>

                                {/* Bottom Divider and Activity */}
                                <div className="border-b w-[370px] mt-4"></div>
                                <p className="text-[14px] font-[700]">
                                  Activity
                                </p>
                                <p className="text-[13px] font-[600] leading-10">
                                  Transaction ID:
                                  <span className="text-[12px] ml-2 font-[600] text-[#00000080]">
                                    {selectedTransaction._id}
                                  </span>
                                </p>
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
                                    className="mt-4 border flex border-black px-1 py-1 rounded"
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
