import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Button, Modal, Input, notification, Switch, Select } from "antd";

import { fn_createStaffApi, fn_getStaffApi, fn_updateStaffApi, fn_deleteStaffApi } from "../../api/api";

import { FiEdit, FiTrash2 } from "react-icons/fi";

const Staff = ({ setSelectedPage, authorization, showSidebar }) => {

  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [staffList, setStaffList] = useState([]);
  const containerHeight = window.innerHeight - 120;
  const [isEditMode, setIsEditMode] = useState(false);
  const [editStaffId, setEditStaffId] = useState(null);

  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    duties: "",
    dashboard: false,
    merchantProfile: false,
    uploadStatement: false,
    transactionHistory: false,
    directPayment: false,
    type: "",
    approvalPoints: false,
    reportsAnalytics: false,
    editPermission: false,
    support: false
  });

  const resetForm = () => {
    setFormData({
      userName: "",
      email: "",
      password: "",
      duties: "",
      dashboard: false,
      merchantProfile: false,
      uploadStatement: false,
      directPayment: false,
      transactionHistory: false,
      approvalPoints: false,
      reportsAnalytics: false,
      editPermission: false,
      type: "",
      support: false
    });
    setErrors({});
    setIsEditMode(false);
    setEditStaffId(null);
  };

  const handleSubmit = async () => {

    if (!validateForm()) return;

    const submitData = new FormData();

    submitData.append("userName", formData.userName);
    submitData.append("email", formData.email);
    submitData.append("password", formData.password);
    submitData.append("type", formData.duties);
    if (formData.duties === "staff") {
      submitData.append("dashboard", formData.dashboard);
      submitData.append("merchantProfile", formData.merchantProfile);
      submitData.append("uploadStatement", formData.uploadStatement);
      submitData.append("transactionHistory", formData.transactionHistory);
      submitData.append("directPayment", formData.directPayment);
      submitData.append("approvalPoints", formData.approvalPoints);
      submitData.append("support", formData.support);
      submitData.append("reportsAnalytics", formData.reportsAnalytics);
      submitData.append("editPermission", formData.editPermission);
    } else if (formData.duties === "major") {
      submitData.append("dashboard", false);
      submitData.append("merchantProfile", false);
      submitData.append("uploadStatement", false);
      submitData.append("transactionHistory", false);
      submitData.append("directPayment", true);
      submitData.append("approvalPoints", true);
      submitData.append("support", false);
      submitData.append("reportsAnalytics", false);
      submitData.append("editPermission", true);
    } else if (formData.duties === "minor") {
      submitData.append("dashboard", false);
      submitData.append("merchantProfile", false);
      submitData.append("uploadStatement", false);
      submitData.append("transactionHistory", false);
      submitData.append("directPayment", true);
      submitData.append("approvalPoints", true);
      submitData.append("support", false);
      submitData.append("reportsAnalytics", false);
      submitData.append("editPermission", false);
    }

    try {
      let response;
      if (isEditMode) {
        response = await fn_updateStaffApi(editStaffId, submitData);
      } else {
        response = await fn_createStaffApi(submitData);
      }

      if (response?.status) {
        notification.success({
          message: "Success",
          description: isEditMode ? "Staff updated successfully!" : "Staff created successfully!",
          placement: "topRight",
        });
        setOpen(false);
        resetForm();
        fetchStaffList();
      } else {
        notification.error({
          message: "Error",
          description:
            response?.message ||
            `Failed to ${isEditMode ? "update" : "create"} staff`,
          placement: "topRight",
        });
      }
    } catch (error) {
      notification.error({
        message: "Error",
        description: "An unexpected error occurred",
        placement: "topRight",
      });
    }
  };

  const handleAddStaff = () => {
    resetForm();
    setOpen(true);
  };

  const handleEdit = (staff) => {
    setFormData({
      userName: staff?.userName,
      email: staff?.email,
      password: staff?.password,
      duties: staff?.type,
      dashboard: staff?.dashboard,
      merchantProfile: staff?.merchantProfile,
      uploadStatement: staff?.uploadStatement,
      transactionHistory: staff?.transactionHistory,
      directPayment: staff?.directPayment,
      approvalPoints: staff?.approvalPoints,
      reportsAnalytics: staff?.reportsAnalytics,
      editPermission: staff?.editPermission,
      support: staff?.support
    });
    setEditStaffId(staff._id);
    setIsEditMode(true);
    setOpen(true);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.userName.trim()) newErrors.userName = "Username is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 5) {
      newErrors.password = "Password must be at least 6 characters long";
    } else if (!formData.duties.trim()) {
      newErrors.password = "Select Duty";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDeleteStaff = async (staffId) => {
    try {
      const response = await fn_deleteStaffApi(staffId);
      if (response?.status) {
        notification.success({
          message: "Success",
          description: "Staff Deleted Successfully!",
          placement: "topRight",
        });
        fetchStaffList();
      } else {
        notification.error({
          message: "Error",
          description: response?.message || "Failed to delete staff",
          placement: "topRight",
        });
      }
    } catch (error) {
      notification.error({
        message: "Error",
        description: "An unexpected error occurred while deleting staff",
        placement: "topRight",
      });
    }
  };

  const handleStatusChange = async (staffId, checked) => {
    try {
      const currentStaff = staffList.find((staff) => staff._id === staffId);
      if (!currentStaff) return;

      const response = await fn_updateStaffApi(staffId, {
        block: !checked,
        status: checked ? "Active" : "Inactive",
      });

      if (response?.status) {
        setStaffList((prev) =>
          prev.map((staff) =>
            staff._id === staffId
              ? {
                ...staff,
                block: !checked,
                status: checked ? "Active" : "Inactive",
              }
              : staff
          )
        );

        notification.success({
          message: "Status Updated",
          description: `Staff ${checked ? "activated" : "deactivated"
            } successfully!`,
          placement: "topRight",
        });

        await fetchStaffList();
      } else {
        notification.error({
          message: "Error",
          description: response?.message || "Failed to update staff status",
          placement: "topRight",
        });
      }
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to update staff status",
        placement: "topRight",
      });
    }
  };

  useEffect(() => {
    if (!authorization) {
      navigate("/login");
      return;
    }
    setSelectedPage("staff");
  }, [authorization, navigate, setSelectedPage]);

  const fetchStaffList = async () => {
    try {
      const result = await fn_getStaffApi();
      if (result.status) {
        setStaffList(result?.data?.data);
      } else {
        notification.error({
          message: "Error",
          description: result.message || "Failed to fetch staff data",
          placement: "topRight",
        });
      }
    } catch (error) {
      notification.error({
        message: "Error",
        description: "An unexpected error occurred while fetching staff data",
        placement: "topRight",
      });
    }
  };

  useEffect(() => {
    fetchStaffList();
  }, []);

  return (
    <>
      <div
        className={`bg-gray-100 transition-all duration-500 ${showSidebar ? "pl-0 md:pl-[270px]" : "pl-0"
          }`}
        style={{ minHeight: `${containerHeight}px` }}
      >
        <div className="p-7">
          <div className="flex flex-col md:flex-row gap-[12px] items-center justify-between mb-7">
            <h1 className="text-[25px] font-[500]">Staff Management</h1>
            <p className="text-[#7987A1] text-[13px] md:text-[15px] font-[400]">
              Dashboard - Staff Table
            </p>
          </div>

          <div className="bg-white rounded-lg p-4">
            <div className="p-3 flex flex-col md:flex-row items-center justify-between border-b space-y-4 md:space-y-0">
              <h2 className="text-black font-medium text-lg">
                Staff Information
              </h2>
              <Button
                type="primary"
                onClick={handleAddStaff}
                className="w-full md:w-auto"
              >
                Add Staff
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full border">
                <thead className="bg-[#ECF0FA]">
                  <tr className="bg-[#ECF0FA] text-left text-[12px] text-gray-700">
                    <th className="p-3 text-[13px] font-[600]">Sr No.</th>
                    <th className="p-3 text-[13px] font-[600]">Name</th>
                    <th className="p-3 text-[13px] font-[600]">Email</th>
                    <th className="pl-7 text-[13px] font-[600]">Status</th>
                    <th className="p-3 text-[13px] font-[600] text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {staffList.length > 0 ? (
                    staffList.map((staff, index) => (
                      <tr key={staff.id} className="border">
                        <td className="p-3 text-[13px]">{index + 1}</td>
                        <td className="p-3 text-[13px]">{staff.userName}</td>
                        <td className="p-3 text-[13px]">{staff.email}</td>
                        <td className="p-3">
                          <button
                            className={`px-3 py-[5px] rounded-[20px] w-20 flex items-center justify-center text-[11px] font-[500] ${!staff.block
                              ? "bg-[#10CB0026] text-[#0DA000]"
                              : "bg-[#FF173D33] text-[#D50000]"
                              }`}
                          >
                            {!staff.block ? "Active" : "Inactive"}
                          </button>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center justify-center gap-2">
                            <Switch
                              size="small"
                              className="min-w-[28px]"
                              checked={!staff.block}
                              onChange={(checked) =>
                                handleStatusChange(staff._id, checked)
                              }
                            />
                            <Button
                              className="bg-green-100 hover:bg-green-200 text-green-600 rounded-full p-2 flex items-center justify-center min-w-[32px] h-[32px] border-none"
                              title="Edit"
                              onClick={() => handleEdit(staff)}
                            >
                              <FiEdit size={16} />
                            </Button>
                            <Button
                              className="bg-red-100 hover:bg-red-200 text-red-600 rounded-full p-2 flex items-center justify-center min-w-[32px] h-[32px] border-none"
                              title="Delete"
                              onClick={() => handleDeleteStaff(staff._id)}
                            >
                              <FiTrash2 size={16} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr className="border-t border-b">
                      <td className="p-3 text-center" colSpan="5">
                        No staff data available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Modal
        title={
          <p className="text-[20px] font-[600]">
            {isEditMode ? "Edit Staff" : "Add New Staff"}
          </p>
        }
        open={open}
        onCancel={() => {
          setOpen(false);
          resetForm();
        }}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              setOpen(false);
              resetForm();
            }}
          >
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleSubmit}>
            Save
          </Button>,
        ]}
        width={600}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium mb-1">
                Username <span className="text-red-500">*</span>
              </p>
              <Input
                value={formData.userName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    userName: e.target.value,
                  }))
                }
                status={errors.userName ? "error" : ""}
                placeholder="Enter username"
              />
              {errors.userName && (
                <p className="text-red-500 text-xs mt-1">{errors.userName}</p>
              )}
            </div>

            <div>
              <p className="text-sm font-medium mb-1">
                Email <span className="text-red-500">*</span>
              </p>
              <Input
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                status={errors.email ? "error" : ""}
                placeholder="Enter email address"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-1">
              Password{" "}
              {!isEditMode && <span className="text-red-500">*</span>}
            </p>
            <Input.Password
              value={formData.password}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  password: e.target.value,
                }))
              }
              status={errors.password ? "error" : ""}
              placeholder="Enter password"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          <div>
            <p className="text-sm font-medium mb-1">
              Staff Type{" "}
              {!isEditMode && <span className="text-red-500">*</span>}
            </p>
            <Select
              className="w-full"
              value={formData.duties === "" ? undefined : formData.duties}
              placeholder="Select Staff Type"
              status={errors.duties ? "error" : ""}
              onChange={(value) => setFormData((prev) => ({ ...prev, duties: value }))}
            >
              <Option value="major">Major Staff</Option>
              <Option value="minor">Minor Staff</Option>
              <Option value="staff">Merchant</Option>
            </Select>
            {errors.duties && (
              <p className="text-red-500 text-xs mt-1">{errors.duties}</p>
            )}
          </div>

          {formData?.duties === "staff" && (
            <div>
              <p className="text-sm font-medium mb-1">Permissions{" "}{!isEditMode && <span className="text-red-500">*</span>}</p>
              <div className="flex flex-col items-start">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="dashboard"
                    checked={formData?.dashboard}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        dashboard: e.target.checked,
                      }))
                    }
                    className="mr-2 cursor-pointer"
                  />
                  <label htmlFor="dashboard" className="cursor-pointer">Dashboard</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="transaction-history"
                    checked={formData?.transactionHistory}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        transactionHistory: e.target.checked,
                      }))
                    }
                    className="mr-2 cursor-pointer"
                  />
                  <label htmlFor="transaction-history" className="cursor-pointer">Transaction History</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="direct-payment"
                    checked={formData?.directPayment}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        directPayment: e.target.checked,
                      }))
                    }
                    className="mr-2 cursor-pointer"
                  />
                  <label htmlFor="direct-payment" className="cursor-pointer">Direct Payment</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="approval-points"
                    checked={formData?.approvalPoints}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        approvalPoints: e.target.checked,
                      }))
                    }
                    className="mr-2 cursor-pointer"
                  />
                  <label htmlFor="approval-points" className="cursor-pointer">Approval Points</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="merchant-profile"
                    checked={formData?.merchantProfile}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        merchantProfile: e.target.checked,
                      }))
                    }
                    className="mr-2 cursor-pointer"
                  />
                  <label htmlFor="merchant-profile" className="cursor-pointer">Merchant Profile</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="reports-analytics"
                    checked={formData?.reportsAnalytics}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        reportsAnalytics: e.target.checked,
                      }))
                    }
                    className="mr-2 cursor-pointer"
                  />
                  <label htmlFor="reports-analytics" className="cursor-pointer">Reports And Analytics</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="support"
                    checked={formData?.support}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        support: e.target.checked,
                      }))
                    }
                    className="mr-2 cursor-pointer"
                  />
                  <label htmlFor="support" className="cursor-pointer">Support and Help Center</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="upload-statement"
                    checked={formData?.uploadStatement}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        uploadStatement: e.target.checked,
                      }))
                    }
                    className="mr-2 cursor-pointer"
                  />
                  <label htmlFor="upload-statement" className="cursor-pointer">Upload Statement</label>
                </div>
              </div>
            </div>
          )}
          {formData?.duties === "staff" && (
            <>
              <hr />
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="edit-permission"
                  checked={formData?.editPermission}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      editPermission: e.target.checked,
                    }))
                  }
                  className="mr-2 cursor-pointer"
                />
                <label htmlFor="edit-permission" className="cursor-pointer">Allow to Edit or Delete Data</label>
              </div>
            </>
          )}
        </div>
      </Modal>
    </>
  );
};

export default Staff;
