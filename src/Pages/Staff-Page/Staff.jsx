import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Button, Modal, Input, notification, Switch, Select } from "antd";

import { fn_createStaffApi, fn_getStaffApi, fn_updateStaffApi, fn_deleteStaffApi } from "../../api/api";

import { FiEdit, FiTrash2 } from "react-icons/fi";
import { PiArrowBendDownRightFill } from "react-icons/pi";

const Staff = ({ setSelectedPage, authorization, showSidebar }) => {

  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [staffList, setStaffList] = useState([]);
  const containerHeight = window.innerHeight - 120;
  const [isEditMode, setIsEditMode] = useState(false);
  const [editStaffId, setEditStaffId] = useState(null);

  const [checkedPages, setCheckPages] = useState({
    transactionHistory: { view: false, edit: false },
    directPayment: { view: false, edit: false },
    approvalPoints: { view: false, edit: false },
    support: { view: false, edit: false }
  });

  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: ""
  });

  const resetForm = () => {
    setFormData({
      userName: "",
      email: "",
      password: ""
    });
    setCheckPages({
      transactionHistory: { view: false, edit: false },
      directPayment: { view: false, edit: false },
      approvalPoints: { view: false, edit: false },
      support: { view: false, edit: false }
    })
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
    submitData.append("transactionHistory", JSON.stringify(checkedPages.transactionHistory));
    submitData.append("directPayment", JSON.stringify(checkedPages.directPayment));
    submitData.append("approvalPoints", JSON.stringify(checkedPages.approvalPoints));
    submitData.append("support", JSON.stringify(checkedPages.support));
    try {
      let response;
      if (isEditMode) {
        response = await fn_updateStaffApi(editStaffId, { ...formData, ...checkedPages });
      } else {
        response = await fn_createStaffApi({ ...formData, ...checkedPages });
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

  const fn_changeCheckbox = (e, label, option) => {
    const isChecked = e.target.checked;
    setCheckPages((prev) => {
      const updated = { ...prev[label], [option]: isChecked };
      if (option === "view" && !isChecked) {
        updated.edit = false;
      };
      return { ...prev, [label]: updated };
    });
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
                            {/* <Button
                              className="bg-green-100 hover:bg-green-200 text-green-600 rounded-full p-2 flex items-center justify-center min-w-[32px] h-[32px] border-none"
                              title="Edit"
                              onClick={() => handleEdit(staff)}
                            >
                              <FiEdit size={16} />
                            </Button> */}
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
              Permissions{" "}
              {!isEditMode && <span className="text-red-500">*</span>}
            </p>
            <div className="flex flex-col gap-[5px]">
              <div className="flex flex-col">
                <div className="flex items-center gap-[10px]">
                  <input type="checkbox" checked={checkedPages.transactionHistory.view} onChange={(e) => fn_changeCheckbox(e, "transactionHistory", "view")} />
                  <p className="text-[13px] font-[500] mt-[-1px]">Transaction History</p>
                </div>
                {checkedPages?.transactionHistory?.view && (
                  <div className="ms-[5px] flex items-center gap-[10px]">
                    <PiArrowBendDownRightFill className="text-gray-500" />
                    <input type="checkbox" checked={checkedPages.transactionHistory.edit} onChange={(e) => fn_changeCheckbox(e, "transactionHistory", "edit")} />
                    <p className="text-[13px] font-[500] mt-[-1px]">Can Edit ?</p>
                  </div>
                )}
              </div>
              <hr />
              <div className="flex flex-col">
                <div className="flex items-center gap-[10px]">
                  <input type="checkbox" checked={checkedPages.directPayment.view} onChange={(e) => fn_changeCheckbox(e, "directPayment", "view")} />
                  <p className="text-[13px] font-[500] mt-[-1px]">Direct Payment</p>
                </div>
                {checkedPages?.directPayment?.view && (
                  <div className="ms-[5px] flex items-center gap-[10px]">
                    <PiArrowBendDownRightFill className="text-gray-500" />
                    <input type="checkbox" checked={checkedPages.directPayment.edit} onChange={(e) => fn_changeCheckbox(e, "directPayment", "edit")} />
                    <p className="text-[13px] font-[500] mt-[-1px]">Can Edit ?</p>
                  </div>
                )}
              </div>
              <hr />
              <div className="flex flex-col">
                <div className="flex items-center gap-[10px]">
                  <input type="checkbox" checked={checkedPages.approvalPoints.view} onChange={(e) => fn_changeCheckbox(e, "approvalPoints", "view")} />
                  <p className="text-[13px] font-[500] mt-[-1px]">Approved Points</p>
                </div>
                {checkedPages?.approvalPoints?.view && (
                  <div className="ms-[5px] flex items-center gap-[10px]">
                    <PiArrowBendDownRightFill className="text-gray-500" />
                    <input type="checkbox" checked={checkedPages.approvalPoints.edit} onChange={(e) => fn_changeCheckbox(e, "approvalPoints", "edit")} />
                    <p className="text-[13px] font-[500] mt-[-1px]">Can Edit ?</p>
                  </div>
                )}
              </div>
              <hr />
              <div className="flex flex-col">
                <div className="flex items-center gap-[10px]">
                  <input type="checkbox" checked={checkedPages.support.view} onChange={(e) => fn_changeCheckbox(e, "support", "view")} />
                  <p className="text-[13px] font-[500] mt-[-1px]">Support / Help Center</p>
                </div>
                {checkedPages?.support?.view && (
                  <div className="ms-[5px] flex items-center gap-[10px]">
                    <PiArrowBendDownRightFill className="text-gray-500" />
                    <input type="checkbox" checked={checkedPages.support.edit} onChange={(e) => fn_changeCheckbox(e, "support", "edit")} />
                    <p className="text-[13px] font-[500] mt-[-1px]">Can Edit ?</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Staff;
