import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Switch, Button, Modal, Input, Checkbox, notification } from "antd";
import { FiEdit, FiTrash2 } from "react-icons/fi";

const Staff = ({ setSelectedPage, authorization, showSidebar }) => {
  const navigate = useNavigate();
  const containerHeight = window.innerHeight - 120;
  const [staffList, setStaffList] = useState([
    {
      id: 1,
      name: "Hafeez",
      email: "hafeez@gmail.com",
      active: true,
      permissions: ["merchant-profile"],
    },
    {
      id: 2,
      name: "Irfan",
      email: "irfan@gmail.com",
      active: false,
      permissions: ["upload-statement"],
    },
    {
      id: 3,
      name: "Sahir",
      email: "sahir@gmail.com",
      active: true,
      permissions: ["merchant-profile", "upload-statement"],
    },
    {
      id: 4,
      name: "Hafeez",
      email: "hafeez@gmail.com",
      active: false,
      permissions: [],
    },
  ]);
  const [open, setOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editStaffId, setEditStaffId] = useState(null);
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    active: true,
    permissions: [],
  });

  useEffect(() => {
    window.scroll(0, 0);
    if (!authorization) {
      navigate("/login");
      return;
    }
    setSelectedPage("staff");
  }, []);

  const handleToggleActive = (id) => {
    setStaffList((prevList) =>
      prevList.map((staff) =>
        staff.id === id ? { ...staff, active: !staff.active } : staff
      )
    );
  };

  const handleEdit = (staff) => {
    setData({
      name: staff.name,
      email: staff.email,
      password: "",
      active: staff.active,
      permissions: staff.permissions,
    });
    setEditStaffId(staff.id);
    setIsEditMode(true);
    setOpen(true);
  };

  const handleAddStaff = () => {
    setData({
      name: "",
      email: "",
      password: "",
      active: true,
      permissions: [],
    });
    setIsEditMode(false);
    setEditStaffId(null);
    setOpen(true);
  };

  const handleDelete = (id) => {
    setStaffList((prevList) => prevList.filter((staff) => staff.id !== id));
  };

  const handleSubmit = () => {
    if (data.name === "" || data.email === "" || data.password === "") {
      notification.error({
        message: "Error",
        description: "Please fill in all required fields.",
        placement: "topRight",
      });
      return;
    }

    if (isEditMode) {
      setStaffList((prevList) =>
        prevList.map((staff) =>
          staff.id === editStaffId ? { ...staff, ...data } : staff
        )
      );
      notification.success({
        message: "Success",
        description: "Staff updated successfully!",
        placement: "topRight",
      });
    } else {
      setStaffList((prevList) => [
        ...prevList,
        { ...data, id: prevList.length + 1 },
      ]);
      notification.success({
        message: "Success",
        description: "Staff added successfully!",
        placement: "topRight",
      });
    }

    setOpen(false);
  };

  const handlePermissionsChange = (checkedValues) => {
    setData((prev) => ({ ...prev, permissions: checkedValues }));
  };

  return (
    <div
      className={`bg-gray-100 transition-all duration-500 ${
        showSidebar ? "pl-0 md:pl-[270px]" : "pl-0"
      }`}
      style={{ minHeight: `${containerHeight}px` }}
    >
      <div className="p-7">
        <div className="flex flex-col md:flex-row gap-[12px] items-center justify-between mb-7">
          <h1 className="text-[25px] font-[500]">Staff</h1>
          <p className="text-[#7987A1] text-[13px] md:text-[15px] font-[400]">
            Dashboard - Staff Table
          </p>
        </div>
        <div className="bg-white rounded-lg p-4">
          <div className="p-3 flex flex-col md:flex-row items-center md:items-center justify-between border-b space-y-4 md:space-y-0">
            <p className="text-black font-medium text-lg text-center w-full md:w-auto">
              Staff Information
            </p>
            <Button
              type="primary"
              onClick={handleAddStaff}
              className="w-full md:w-auto"
            >
              Add Staff
            </Button>
            <Modal
              centered
              width={600}
              style={{ fontFamily: "sans-serif" }}
              title={
                <p className="text-[16px] font-[700]">
                  {isEditMode ? "Edit Staff" : "Add New Staff"}
                </p>
              }
              footer={
                <div className="flex gap-4 mt-6">
                  <Button
                    className="flex start px-10 text-[12px]"
                    type="primary"
                    onClick={handleSubmit}
                  >
                    Save
                  </Button>
                  <Button
                    className="flex start px-10 bg-white text-[#FF3D5C] border border-[#FF7A8F] text-[12px]"
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
              <div className="flex gap-4">
                <div className="flex-1 my-2">
                  <p className="text-[12px] font-[500] pb-1">
                    Staff Name <span className="text-[#D50000]">*</span>
                  </p>
                  <Input
                    value={data.name}
                    onChange={(e) =>
                      setData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="w-full text-[12px]"
                    placeholder="Enter Staff Name"
                  />
                </div>
                <div className="flex-1 my-2">
                  <p className="text-[12px] font-[500] pb-1">
                    Staff Email <span className="text-[#D50000]">*</span>
                  </p>
                  <Input
                    value={data.email}
                    onChange={(e) =>
                      setData((prev) => ({ ...prev, email: e.target.value }))
                    }
                    className="w-full text-[12px]"
                    placeholder="Enter Staff Email"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-1 my-2">
                  <p className="text-[12px] font-[500] pb-1">
                    Password <span className="text-[#D50000]">*</span>
                  </p>
                  <Input.Password
                    value={data.password}
                    onChange={(e) =>
                      setData((prev) => ({ ...prev, password: e.target.value }))
                    }
                    className="w-full text-[12px]"
                    placeholder="Enter Password"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-1 my-2">
                  <p className="text-[12px] font-[500] pb-1">
                    Permissions <span className="text-[#D50000]">*</span>
                  </p>
                  <Checkbox.Group
                    options={[
                      { label: "Merchant Profile", value: "merchant-profile" },
                      { label: "Upload Statement", value: "upload-statement" },
                    ]}
                    value={data.permissions}
                    onChange={handlePermissionsChange}
                  />
                </div>
              </div>
            </Modal>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#ECF0FA]">
                <tr>
                  <th className="p-3 text-[13px] font-[600] text-nowrap">
                    Staff ID
                  </th>
                  <th className="p-3 text-[13px] font-[600] text-nowrap">
                    Staff Name
                  </th>
                  <th className="p-3 text-[13px] font-[600] text-nowrap">
                    Staff Email
                  </th>
                  <th className="pl-6  text-[13px] font-[600] text-nowrap">
                    Status
                  </th>
                  <th className="p-3 text-[13px] font-[600] text-nowrap text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {staffList.map((staff) => (
                  <tr key={staff.id} className="border-t border-b">
                    <td className="p-3 text-[13px]">{staff.id}</td>
                    <td className="p-3 text-[13px]">{staff.name}</td>
                    <td className="p-3 text-[13px]">{staff.email}</td>
                    <td className="p-3 text-[13px] font-[600]">
                      <button
                        className={`px-3 py-[5px] rounded-[20px] w-20 flex items-center justify-center text-[11px] font-[500] ${
                          staff.active
                            ? "bg-[#10CB0026] text-[#0DA000]"
                            : "bg-[#FF173D33] text-[#D50000]"
                        }`}
                      >
                        {staff.active ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="p-3">
                      <div className="flex justify-center items-center gap-2">
                        <Switch
                          size="small"
                          checked={staff.active}
                          onChange={() => handleToggleActive(staff.id)}
                        />
                        <Button
                          className="bg-green-100 text-green-600 rounded-full px-2 py-2"
                          title="Edit"
                          onClick={() => handleEdit(staff)}
                        >
                          <FiEdit />
                        </Button>
                        <Button
                          className="bg-red-100 text-red-600 rounded-full px-2 py-2"
                          title="Delete"
                          onClick={() => handleDelete(staff.id)}
                        >
                          <FiTrash2 />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Staff;
