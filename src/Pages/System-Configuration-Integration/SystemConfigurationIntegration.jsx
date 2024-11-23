import { Input } from "antd";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import gold from "../../assets/gold.svg";

const SystemConfigurationIntegration = ({ showSidebar }) => {
  const containerHeight = window.innerHeight - 120;
  const navigate = useNavigate();

  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  const loginHistory = [
    {
      loginDate: "01 Jan 2024, 09:00 AM",
      logoutDate: "01 Jan 2024, 05:00 PM",
      ipAddress: "192.168.1.101",
      isp: "Comcast",
      city: "New York",
    },
    {
      loginDate: "02 Jan 2024, 10:00 AM",
      logoutDate: "02 Jan 2024, 06:00 PM",
      ipAddress: "192.168.1.102",
      isp: "AT&T",
      city: "San Francisco",
    },
    {
      loginDate: "03 Jan 2024, 08:30 AM",
      logoutDate: "03 Jan 2024, 04:30 PM",
      ipAddress: "192.168.1.103",
      isp: "Spectrum",
      city: "Chicago",
    },
  ];

  const apiKeys = [
    {
      version: "v1.0",
      apiKey: "12345-abcde-67890",
      name: "Main API Key",
      createdOn: "01 Jan 2023",
    },
    {
      version: "v2.0",
      apiKey: "54321-edcba-09876",
      name: "Secondary API Key",
      createdOn: "15 Feb 2023",
    },
  ];

  return (
    <div
      className={`bg-gray-100 transition-all duration-500 ${
        showSidebar ? "pl-0 md:pl-[270px]" : "pl-0"
      }`}
      style={{ minHeight: `${containerHeight}px` }}
    >
      <div className="p-7">
        <div className="flex flex-col md:flex-row gap-[12px] items-center justify-between mb-7">
          <h1 className="text-[20px] md:text-[25px] font-[500]">
            System Configuration Integration
          </h1>
          <p
            onClick={() => navigate("/SystemConfigurationIntegration")}
            className="text-[#7987A1] text-[13px] md:text-[15px] font-[400] cursor-pointer"
          >
            Dashboard - Data Table
          </p>
        </div>

        {/* API keys section */}
        <div className="bg-white rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-3">
            {/* First Row: API Key and Secret Key */}
            <div className="flex flex-col">
              <p className="text-black text-[11px] font-[600]">API Key:</p>
              <Input className="mt-1 text-[10px]" placeholder="Enter API Key" />
            </div>
            <div className="flex flex-col">
              <p className="text-black text-[11px] font-[600]">Secret Key:</p>
              <Input
                className="mt-1 text-[10px]"
                placeholder="Enter Secret Key"
              />
            </div>

            {/* Second Row: Membership and Tier */}
            <div className="flex flex-col">
              <p className="text-black text-[11px] font-[600]">Membership:</p>
              <Input
                className="mt-1 text-[10px]"
                placeholder="Enter Phone Number"
              />
            </div>
            <div className="flex flex-col">
              <p className="text-black text-[11px] font-[600]">Tier:</p>
              <div className="flex items-center mt-1 border border-gray-300 rounded px-2">
                <img className="" src={gold} alt="Gold Icon" />
                <Input
                  className="flex-1 text-[10px]  outline-none border-none"
                  placeholder="Gold"
                />
              </div>
            </div>

            <div className="flex">
              <button className="bg-[#0864E8] text-white px-10  items-center rounded-md hover:bg-[#065BCC]">
                <p className="text-[10px] py-1"> Save</p>
              </button>
            </div>
          </div>
        </div>

        {/* Login history section */}
        <div className="bg-white rounded-lg p-4 mt-6">
          <div className="flex flex-col md:flex-row items-center justify-between pb-3">
            <div>
              <p className="text-black text-[14px] font-[600]">Login History</p>
            </div>
          </div>
          <div className="overflow-x-auto rounded-lg border border-gray-300">
            <table className="min-w-full">
              <thead>
                <tr className="bg-[#ECF0FA] text-left text-[12px] text-gray-700">
                  <th className="p-4">Login Date & Time</th>
                  <th className="p-4">Logout Date & Time</th>
                  <th className="p-4">IP Address</th>
                  <th className="p-4">ISP</th>
                  <th className="p-4">City</th>
                </tr>
              </thead>
              <tbody>
                {loginHistory.length > 0 ? (
                  loginHistory.map((entry, index) => (
                    <tr key={index} className="text-gray-800 text-sm border-b">
                      <td className="p-4 text-[11px] font-[600] text-[#000000B2]">
                        {entry.loginDate}
                      </td>
                      <td className="p-4 text-[11px] font-[600] text-[#000000B2]">
                        {entry.logoutDate}
                      </td>
                      <td className="p-4 text-[11px] font-[600] text-[#000000B2]">
                        {entry.ipAddress}
                      </td>
                      <td className="p-4 text-[11px] font-[600] text-[#000000B2]">
                        {entry.isp}
                      </td>
                      <td className="p-4 text-[11px] font-[600] text-[#000000B2]">
                        {entry.city}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-4 text-center text-gray-500">
                      No login history found.
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

export default SystemConfigurationIntegration;
