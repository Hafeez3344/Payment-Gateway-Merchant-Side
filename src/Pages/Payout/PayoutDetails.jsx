import { RxCross2 } from "react-icons/rx";
import { useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { notification, Pagination, Modal, Input } from "antd";

import { FiEye } from "react-icons/fi";

import BACKEND_URL, { fn_getUploadExcelFileData, fn_updateExcelWithdraw } from "../../api/api";
import { LuImageMinus } from "react-icons/lu";

const PayoutDetails = ({ showSidebar }) => {

  const location = useLocation();
  const { withraw } = location.state;
  const [slipData, setSlipData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const containerHeight = window.innerHeight - 120;
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedWithdrawData, setSelectedWithdrawData] = useState(null);

  const getStatusClass = (status) => {
    switch (status) {
      case "Approved":
        return "bg-[#10CB0026] text-[#0DA000]";
      case "Pending":
        return "bg-[#FFC70126] text-[#FFB800]";
      case "Manual Verified":
        return "bg-[#0865e851] text-[#0864E8]";
      case "Declined":
        return "bg-[#FF7A8F33] text-[#FF002A]";
      case "Cancel":
        return "bg-[rgba(0,0,0,0.1)] text-[#000]";
      default:
        return "bg-[#10CB0026] text-[#0DA000]";
    }
  };

  const getExcelFileData = async () => {
    try {
      const response = await fn_getUploadExcelFileData(withraw._id, currentPage);
      if (response?.status) {
        console.log("Excel details data:", response?.data);
        setSlipData(response?.data?.data || []);
        setTotalPages(response?.data?.totalPages || 1);
      } else {
        notification.error({
          message: "Error",
          description: response?.message,
          placement: "topRight",
        });
      }
    } catch (error) {
      console.error("Error fetching excel data:", error);
    }
  };

  useEffect(() => {
    if (withraw?._id) {
      getExcelFileData();
    }
  }, [withraw?._id, currentPage]);

  const handleViewDetails = (item) => {
    setSelectedWithdrawData(item);
    setIsModalVisible(true);
  };

  const handleCancelPayout = async (item) => {
    const response = await fn_updateExcelWithdraw(item?._id);
    if (response?.status) {
      getExcelFileData();
      notification.success({
        message: "Success",
        description: response?.message,
        placement: "topRight",
      });
    } else {
      notification.error({
        message: "Error",
        description: response?.message,
        placement: "topRight",
      });
    }
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
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
            <h1 className="text-[25px] font-[500]">Payouts Details</h1>
          </div>
          <div className="bg-white">
            <table className="min-w-full border">
              <thead>
                <tr className="bg-[#ECF0FA] text-left text-[12px] text-gray-700">
                  <th className="p-4">S_ID</th>
                  <th className="p-4">Username</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Bank / UPI</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {slipData?.map((item, index) => (
                  <tr key={index} className="text-gray-800 text-sm border-b">
                    <td className="p-4 text-[12px] font-[600] text-[#000000B2]">
                      {index + 1}
                    </td>
                    <td className="p-4 text-[12px] font-[600] text-[#000000B2]">
                      {item?.username}
                    </td>
                    <td className="p-4 text-[12px] font-[700] text-[#000000B2]">
                      ₹ {item?.amount}
                    </td>
                    <td className="p-4 text-[12px] font-[600] text-[#000000B2] text-nowrap">
                      {item?.account}
                    </td>
                    <td className="p-4 text-[13px] font-[500]">
                      <span className={`py-1 rounded-[20px] text-nowrap text-[11px] font-[600] w-[100px] flex items-center justify-center ${getStatusClass(item?.status)}`}>
                        {item?.status}
                      </span>
                    </td>
                    <td className="p-4 text-[12px] font-[600] flex space-x-2">
                      <button
                        className={`rounded-[20px] text-[11px] font-[600] w-[29px] h-[29px] flex items-center justify-center ${item?.status !== "Pending" ? "bg-gray-300 text-black cursor-not-allowed" : "bg-[#FF173D33] text-[#D50000]"}`}
                        onClick={() => handleCancelPayout(item)}
                        disabled={item?.status !== "Pending"}
                        title="Cancel Withdraw ?"
                      >
                        <RxCross2 className="text-[14px]" />
                      </button>
                      <button
                        className="bg-blue-100 text-blue-600 rounded-full px-2 py-2 mx-2"
                        title="View"
                        onClick={() => handleViewDetails(item)}
                      >
                        <FiEye />
                      </button>
                    </td>
                  </tr>
                ))}
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

      <Modal
        title="Payout Details"
        open={isModalVisible}
        onCancel={handleModalClose}
        width={(selectedWithdrawData?.status === "Pending" || selectedWithdrawData?.status === "Cancel") ? 600 : 900}
        style={{ fontFamily: "sans-serif" }}
        footer={null}
      >
        {selectedWithdrawData && (
          <div className="flex justify-between gap-4">
            {/* Left Column */}
            <div className={`${(selectedWithdrawData.status === "Pending" || selectedWithdrawData.status === "Cancel") ? "w-full" : "w-[450px]"}`}>
              <div className="flex flex-col gap-2 mt-3">
                {/* Transaction Time */}
                <p className="text-[12px] font-[500] text-gray-600 mt-[-18px]">
                  Transaction Time:{" "}
                  <span className="font-[600]">
                    {new Date(selectedWithdrawData?.createdAt).toDateString()},
                    {new Date(selectedWithdrawData?.createdAt).toLocaleTimeString()}
                  </span>
                </p>

                {/* Username */}
                <div className="flex items-center gap-4 mt-[10px]">
                  <p className="text-[12px] font-[600] w-[200px]">Username:</p>
                  <Input
                    className="text-[12px] bg-gray-200"
                    readOnly
                    value={selectedWithdrawData?.username || "N/A"}
                  />
                </div>

                {/* Amount */}
                <div className="flex items-center gap-4">
                  <p className="text-[12px] font-[600] w-[200px]">Amount:</p>
                  <Input
                    className="text-[12px] bg-gray-200"
                    readOnly
                    value={`₹ ${selectedWithdrawData?.amount}` || "N/A"}
                  />
                </div>

                {/* Account Details */}
                <div className="border-t mt-2 mb-1"></div>
                <p className="font-[600] text-[14px] mb-2">Account Details</p>

                <div className="flex items-center gap-4">
                  <p className="text-[12px] font-[600] w-[200px]">Account Type:</p>
                  <Input
                    className="text-[12px] bg-gray-200"
                    readOnly
                    value={selectedWithdrawData?.account?.includes("@") ? "UPI" : "Bank"}
                  />
                </div>

                <div className="flex items-center gap-4">
                  <p className="text-[12px] font-[600] w-[200px]">Account Info:</p>
                  <Input
                    className="text-[12px] bg-gray-200"
                    readOnly
                    value={selectedWithdrawData?.account || "N/A"}
                  />
                </div>

                {/* Status Section */}
                <div className="border-t mt-2 mb-1"></div>
                <div className="flex items-center">
                  <p className="text-[12px] font-[600] w-[150px]">Status:</p>
                  <div
                    className={`px-3 py-2 rounded-[20px] w-[100px] text-center text-[13px] font-[600] ${getStatusClass(selectedWithdrawData?.status)}`}
                  >
                    {selectedWithdrawData?.status}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Only show for non-pending status */}
            {selectedWithdrawData.status !== "Pending" && selectedWithdrawData.status !== "Cancel" && selectedWithdrawData?.status !== "Decline" && (
              <div className="w-[350px] border-l pl-4">
                <div className="flex flex-col gap-4">

                  {/* UTR Number */}
                  {selectedWithdrawData.utr && (
                    <div>
                      <p className="text-[14px] font-[600] mb-2">UTR Number</p>
                      <Input
                        className="text-[12px] bg-gray-100"
                        readOnly
                        value={selectedWithdrawData.utr}
                      />
                    </div>
                  )}

                  {/* Payment Proof */}
                  {selectedWithdrawData?.image ? (
                    <div>
                      <p className="text-[14px] font-[600] mb-2">
                        Payment Proof
                      </p>
                      <div className="max-h-[400px] overflow-auto">
                        <img
                          src={`${BACKEND_URL}/${selectedWithdrawData?.image}`}
                          alt="Payment Proof"
                          className="w-full object-contain cursor-pointer"
                          onClick={() =>
                            window.open(
                              selectedWithdrawData?.image,
                              "_blank"
                            )
                          }
                        />
                      </div>
                    </div>
                  ) : (
                    <p className="text-center italic text-gray-500 font-[500] mt-[10px]"><LuImageMinus className="inline-block mr-2 text-[22px] mt-[-2px]" />No Image Proof Provided</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </>
  );
};

export default PayoutDetails;