import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import Rectangle from "../../assets/Rectangle.jpg";
import { useNavigate } from "react-router-dom";
import CanaraBank from "../../assets/CanaraBank.svg";
import upilogo2 from "../../assets/upilogo2.svg";
import { FiEdit } from "react-icons/fi";
import { Switch, Button, Modal, Input, notification } from "antd";
import mehtaLogo from "../../assets/mehtaLogo.png";
import axios from "axios";
import BACKEND_URL, {
  fn_BankUpdate,
  fn_getBankByAccountTypeApi,
} from "../../api/api";

const MerchantManagement = ({ setSelectedPage, authorization, showSidebar }) => {
  const [activeTab, setActiveTab] = useState("bank");
  const [banksData, setBanksData] = useState([]);
  const bank = [];
  const upi = [];
  const accountsToShow = activeTab === "bank" ? bank : upi;
  const [open, setOpen] = React.useState(false);
  const containerHeight = window.innerHeight - 120;
  const navigate = useNavigate();
  const { TextArea } = Input;
  const [data, setData] = useState({
    image: {},
    bankName: "",
    accountNo: "",
    accountType: "",
    iban: "",
    accountLimit: "",
    accountHolderName: "",
  });

  useEffect(() => {
    window.scroll(0, 0);
    if (!authorization) {
      navigate("/login");
    }
    setSelectedPage("merchant-profile")
    fn_getBankByAccountType();
  }, [activeTab]);

  const fn_getBankByAccountType = async () => {
    const response = await fn_getBankByAccountTypeApi(activeTab.toLowerCase());
    console.log(response);
    if (response?.status) {
      if (response?.data?.status === "ok") {
        setBanksData(response?.data?.data);
      }
    }
  };

  const handleToggle = (index) => {
    setMerchants((prevMerchants) =>
      prevMerchants.map((merchant, i) =>
        i === index ? { ...merchant, isToggled: !merchant.isToggled } : merchant
      )
    );
  };

  const fn_submit = async () => {
    try {
      const formData = new FormData();
      if (activeTab === "bank") {
        formData.append("image", data?.image);
        formData.append("bankName", data?.bankName);
        formData.append("accountNo", data?.accountNo);
        formData.append("accountType", activeTab);
        formData.append("iban", data?.iban);
        formData.append("accountLimit", data?.accountLimit);
        formData.append("accountHolderName", data?.accountHolderName);
        formData.append("block", true);
      } else {
        formData.append("image", data?.image);
        formData.append("accountType", activeTab);
        formData.append("iban", data?.iban);
        formData.append("accountLimit", data?.accountLimit);
        formData.append("accountHolderName", data?.accountHolderName);
        formData.append("block", true);
      }
      const token = Cookies.get("merchantToken");
      const response = await axios.post(
        `${BACKEND_URL}/bank/create`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response?.status === 200) {
        setOpen(false);

        notification.success({
          message: "Success",
          description: "Bank Created Successfully!",
          placement: "topRight",
        });

        fn_getBankByAccountType(); // Refresh the bank data
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Network Error";
      notification.error({
        message: "Error",
        description: errorMessage,
        placement: "topRight",
      });
    }
  };

  return (
    <div
      className={`bg-gray-100 transition-all duration-500 ${
        showSidebar ? "pl-0 md:pl-[270px]" : "pl-0"
      }`}
      style={{ minHeight: `${containerHeight}px` }}
    >
      <div className="p-7">
        {/* header */}
        <div className="flex flex-col md:flex-row gap-[12px] items-center justify-between mb-7">
          <h1 className="text-[25px] font-[500]">Banks Details</h1>
          <p className="text-[#7987A1] text-[13px] md:text-[15px] font-[400]">
            Dashboard - Data Table
          </p>
        </div>
        <div className="flex flex-col gap-7 md:flex-row bg-gray-100 ">
          {/* Left side card */}
          <div className="w-full md:w-2/6 bg-white rounded-lg lg:min-h-[550px] shadow-md border">
            <div className="flex flex-col z-[-1] items-center">
              <img
                src={Rectangle}
                alt="image"
                className="h-[130px] object-cover w-full rounded-t-lg"
              />
              <div
                className="w-[150px] h-[150px] rounded-full flex justify-center items-center bg-white mt-[-75px] z-[9]"
                style={{ boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.15)" }}
              >
                <img src={mehtaLogo} alt="logo" className="w-[75px]" />
              </div>
            </div>
            <h2 className="text-[18px] font-[600] mt-4 text-center">
              Mehta & Mehta
            </h2>
            <p className="text-gray-500 text-[13px] text-center">@mehta823</p>
            <div className="m-3 mt-6">
              <h3 className="text-[16px] font-[600] border-b pb-2">
                Personal Info
              </h3>
              <div className="space-y-3 pt-3">
                <div className="flex">
                  <span className="text-[12px] font-[600] min-w-[105px] max-w-[105px]">
                    Full Name:
                  </span>
                  <span className="text-[12px] font-[600] text-left text-[#505050] w-full">
                    Mehta & Mehta
                  </span>
                </div>
                <div className="flex">
                  <span className="text-[12px] font-[600] min-w-[105px] max-w-[105px]">
                    Email:
                  </span>
                  <span className="text-[12px] font-[600] text-left text-[#505050] w-full">
                    willjontoax@gmail.com
                  </span>
                </div>
                <div className="flex">
                  <span className="text-[12px] font-[600] min-w-[105px] max-w-[105px]">
                    Phone Number:
                  </span>
                  <span className="text-[12px] font-[600] text-left text-[#505050] w-full">
                    (1) 2536 2561 2365
                  </span>
                </div>
                <div className="flex">
                  <span className="text-[12px] font-[600] min-w-[105px] max-w-[105px]">
                    Website:
                  </span>
                  <a
                    href=": www.mehta&mehta.com"
                    className="text-[12px] font-[600] text-left text-[#505050] w-full"
                  >
                    www.betpay.com
                  </a>
                </div>
                <div className="flex">
                  <span className="text-[12px] font-[600] min-w-[105px] max-w-[105px]">
                    Bio:
                  </span>
                  <span className="text-[12px] font-[600] text-[#505050] w-full">
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry.
                  </span>
                </div>
              </div>
            </div>
          </div>
          {/* Right side Card */}
          <div className="w-full md:w-3/4 lg:min-h-[550px] bg-white rounded-lg shadow-md border">
            {/* Header */}
            <div className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between border-b space-y-4 md:space-y-0">
              {/* Tab Buttons */}
              <div className="w-full md:w-auto">
                <button
                  className="text-[14px] font-[600] px-4 py-2 w-full md:w-auto border-t"
                  style={{
                    backgroundImage:
                      activeTab === "bank"
                        ? "linear-gradient(rgba(8, 100, 232, 0.1), rgba(115, 115, 115, 0))"
                        : "none",
                  }}
                  onClick={() => setActiveTab("bank")}
                >
                  Bank Accounts
                </button>
                <button
                  className="text-[14px] font-[600] px-4 py-2 w-full md:w-auto border-t"
                  style={{
                    backgroundImage:
                      activeTab === "upi"
                        ? "linear-gradient(rgba(8, 100, 232, 0.1), rgba(115, 115, 115, 0))"
                        : "none",
                  }}
                  onClick={() => setActiveTab("upi")}
                >
                  UPI Accounts
                </button>
              </div>

              <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 w-full md:w-auto">
                <Button type="primary" onClick={() => setOpen(true)}>
                  Add Account
                </Button>
                <Modal
                  centered
                  width={600}
                  style={{ fontFamily: "sans-serif" }}
                  title={
                    <p className="text-[16px] font-[700]">
                      Add New Bank Account
                    </p>
                  }
                  footer={
                    <div className="flex gap-4 mt-6">
                      <Button
                        className="flex start px-10 text-[12px]"
                        type="primary"
                        onClick={() => {
                          fn_submit();
                          setOpen(false);
                        }}
                      >
                        Save
                      </Button>

                      <Button
                        className="flex start px-10 bg-white text-[#FF3D5C] border border-[#FF7A8F] text-[12px]"
                        type=""
                        onClick={() => setOpen(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  }
                  open={open}
                  onCancel={() => setOpen(false)}
                  onClose={() => setOpen(false)}
                >
                  {activeTab === "bank" && (
                    <div className="flex gap-4 ">
                      {/* Bank Name */}
                      <div className="flex-1 my-2">
                        <p className="text-[12px] font-[500] pb-1">
                          Bank Name <span className="text-[#D50000]">*</span>
                        </p>
                        <Input
                          value={data?.bankName}
                          onChange={(e) =>
                            setData((prev) => ({
                              ...prev,
                              bankName: e.target.value,
                            }))
                          }
                          className="w-full text-[12px]"
                          placeholder="Enter Bank Name"
                        />
                      </div>
                      {/* Account Number */}
                      <div className="flex-1 my-2">
                        <p className="text-[12px] font-[500] pb-1">
                          Account Number{" "}
                          <span className="text-[#D50000]">*</span>
                        </p>
                        <Input
                          value={data?.accountNo}
                          onChange={(e) =>
                            setData((prev) => ({
                              ...prev,
                              accountNo: e.target.value,
                            }))
                          }
                          className="w-full  text-[12px]"
                          placeholder="Enter Account Number"
                        />
                      </div>
                    </div>
                  )}
                  <div className="flex gap-4">
                    {/* IBAN No. */}
                    <div className="flex-1 my-2">
                      <p className="text-[12px] font-[500] pb-1">
                        {activeTab === "bank" ? (
                          <>
                            IBAN No. <span className="text-[#D50000]">*</span>
                          </>
                        ) : (
                          <>
                            UPI ID <span className="text-[#D50000]">*</span>
                          </>
                        )}
                      </p>
                      <Input
                        value={data?.iban}
                        onChange={(e) =>
                          setData((prev) => ({
                            ...prev,
                            iban: e.target.value,
                          }))
                        }
                        className="w-full text-[12px]"
                        placeholder="Enter IBAN Number "
                      />
                    </div>
                    {/* account Holder Name */}
                    <div className="flex-1 my-2">
                      <p className="text-[12px] font-[500] pb-1">
                        Account Holder Name{" "}
                        <span className="text-[#D50000]">*</span>
                      </p>
                      <Input
                        value={data?.accountHolderName}
                        onChange={(e) =>
                          setData((prev) => ({
                            ...prev,
                            accountHolderName: e.target.value,
                          }))
                        }
                        className="w-full text-[12px]"
                        placeholder="Account Holder Name"
                      />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    {/* Account Limit */}
                    <div className="flex-1 my-2">
                      <p className="text-[12px] font-[500] pb-1">
                        Account Limit <span className="text-[#D50000]">*</span>
                      </p>
                      <Input
                        value={data?.accountLimit}
                        onChange={(e) =>
                          setData((prev) => ({
                            ...prev,
                            accountLimit: e.target.value,
                          }))
                        }
                        className="w-full text-[12px]"
                        placeholder="Account Limit "
                      />
                    </div>
                    {/* Account Logo */}
                    <div className="flex-1 my-2">
                      <p className="text-[12px] font-[500] pb-1">
                        Account Logo<span className="text-[#D50000]">*</span>
                      </p>
                      <Input
                        type="file"
                        onChange={(e) => {
                          setData((prev) => ({
                            ...prev,
                            image: e.target.files[0],
                          }));
                        }}
                        className="w-full text-[12px]"
                        placeholder="Enter IBAN Number "
                      />
                    </div>
                  </div>
                </Modal>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#ECF0FA]">
                  <tr>
                    <th className="p-3 text-[13px] font-[600]">Bank Name</th>
                    <th className="p-5 text-[13px] font-[600]">
                      {activeTab === "upi" ? "UPI ID" : "IBAN"}
                    </th>
                    <th className="p-5 text-[13px] font-[600] whitespace-nowrap">
                      Account Title
                    </th>
                    <th className="p-5 text-[13px] font-[600]">Limit</th>
                    <th className="p-5 text-[13px] font-[600]">Status</th>
                    <th className="p-5 text-[13px] font-[600]">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {banksData.map((account, index) => {
                    const accountStatus = account.status || "Active";
                    return (
                      <tr
                        key={index}
                        className={`border-t border-b ${
                          index % 2 === 0 ? "bg-white" : ""
                        }`}
                      >
                        <td className="p-3 text-[13px] font-[600]">
                          <div className="flex items-center space-x-2 flex-wrap md:flex-nowrap">
                            {activeTab === "bank" ? (
                              <div className="flex items-center gap-[3px]">
                                <img src={`${BACKEND_URL}/${account?.image}`} alt="" className="w-[50px]" />
                                <span className="whitespace-nowrap">
                                  {account.bankName}
                                </span>
                              </div>
                            ) : (
                              <img src={upilogo2} alt="" className="w-[50px]" />
                            )}
                          </div>
                        </td>
                        <td className="p-3 text-[13px]">
                          {activeTab === "upi" ? (
                            <>
                              <div>{account.iban}</div>
                              <div className="text-[12px] text-gray-600 mt-1">
                                {account.UPIID}
                              </div>
                            </>
                          ) : (
                            account.iban
                          )}
                        </td>
                        <td className="p-3 text-[13px] whitespace-nowrap">
                          {account.accountHolderName}
                        </td>
                        <td className="p-3 text-[13px] font-[400]">
                          {account.accountLimit}
                        </td>
                        <td className="text-center">
                          <button
                            className={`px-3 py-[5px] rounded-[20px] w-20 flex items-center justify-center text-[11px] font-[500] ${
                              account?.block === false
                                ? "bg-[#10CB0026] text-[#0DA000]"
                                : "bg-[#FF173D33] text-[#D50000]"
                            }`}
                          >
                            {!account?.block ? "Active" : "Inactive"}
                          </button>
                        </td>
                        <td className="p-3 text-center">
                          <div className="flex justify-center items-center">
                            <Switch
                              size="small"
                              checked={!account?.block}
                              onChange={async (checked) => {
                                const newStatus = checked;

                                const response = await fn_BankUpdate(account?._id,
                                  {
                                    block: !newStatus,
                                    accountType: activeTab
                                  }
                                );

                                if (response?.status) {
                                  fn_getBankByAccountType();
                                  notification.success({
                                    message: "Status Updated",
                                    description: `Bank Status Updated!  ${newStatus}.`,
                                    placement: "topRight",
                                  });
                                } else {
                                  notification.error({
                                    message: "Error",
                                    description:
                                      response.message ||
                                      "Failed to update bank status.",
                                    placement: "topRight",
                                  });
                                }
                              }}
                            />
                            <button
                              className="bg-green-100 text-green-600 rounded-full px-2 py-2 mx-2"
                              title="Edit"
                            >
                              <FiEdit />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MerchantManagement;
