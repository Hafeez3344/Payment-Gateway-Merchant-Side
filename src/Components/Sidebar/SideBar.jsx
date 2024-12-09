import React from "react";

import Cookies from "js-cookie";
import logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";

import { LuLogOut } from "react-icons/lu";
import { PiNotebook } from "react-icons/pi";
import { IoAnalytics } from "react-icons/io5";
import { TbBookUpload } from "react-icons/tb";
import { FaHeadphones } from "react-icons/fa";
import { FaRegCircleUser } from "react-icons/fa6";
import { IoSettingsOutline } from "react-icons/io5";
import { MdOutlineDashboard } from "react-icons/md";

const SideBar = ({ showSidebar, setShowSide, setAuthorization, selectedPage, setSelectedPage, setMerchantVerified }) => {

  const navigate = useNavigate();
  const isMobile = () => window.innerWidth < 1024;

  const fn_controlSidebar = () => {
    setShowSide(!showSidebar);
  };

  const fn_logout = () => {
    Cookies.remove('merchantId')
    Cookies.remove('merchantToken')
    localStorage.removeItem('merchantVerified')
    setAuthorization(false);
    setMerchantVerified(true)
    navigate("/login");
  }

  return (
    <div
      className={`fixed w-[270px] h-[100vh] bg-white border-r transition-all duration-500 ${showSidebar ? "left-0" : "left-[-270px]"
        }`}
      style={{ zIndex: 999 }}
    >
      <div className="flex pl-[21px] h-[55px] items-center gap-3 border-b border-secondary">
        <div>
          <img className="w-8 h-8" src={logo} alt="" />
        </div>
        <div className="font-roboto text-[20px] font-[600]">BetPay</div>
        <button
          className="bg-gray-200 h-[25px] w-[25px] rounded-sm flex md:hidden justify-center ml-20 items-center"
          onClick={fn_controlSidebar}
        >
          X
        </button>
      </div>
      <div className="mt-[10px]">
        <Menu
          onClick={() => {
            setSelectedPage("dashboard")
            navigate("/");
            if (isMobile()) fn_controlSidebar();
          }}
          label="Dashboard"
          name="dashboard"
          selectedPage={selectedPage}
          icon={<MdOutlineDashboard className="text-[20px]" />}
        />
        <Menu
          onClick={() => {
            setSelectedPage("transaction-history")
            navigate("/transactions-table");
            if (isMobile()) fn_controlSidebar();
          }}
          label="Transaction History"
          name="transaction-history"
          selectedPage={selectedPage}
          icon={<PiNotebook className="text-[20px]" />}
        />
        <Menu
          onClick={() => {
            setSelectedPage("merchant-profile")
            navigate("/merchant-management");
            if (isMobile()) fn_controlSidebar();
          }}
          label="Merchant Profile"
          name="merchant-profile"
          selectedPage={selectedPage}
          icon={<FaRegCircleUser className="text-[20px]" />}
        />
        <Menu
          onClick={() => {
            setSelectedPage("reports-and-analytics")
            navigate("/reports-and-analytics");
            if (isMobile()) fn_controlSidebar();
          }}
          label="Reports & Analytics"
          name="reports-and-analytics"
          selectedPage={selectedPage}
          icon={<IoAnalytics className="text-[20px]" />}
        />
        <Menu
          onClick={() => {
            setSelectedPage("help-center")
            navigate("/support-help-center");
            if (isMobile()) fn_controlSidebar();
          }}
          label="Support / Help Center"
          name="help-center"
          selectedPage={selectedPage}
          icon={<FaHeadphones className="text-[20px]" />}
        />
        <Menu
          onClick={() => {
            setSelectedPage("setting")
            navigate("/system-configuration");
            if (isMobile()) fn_controlSidebar();
          }}
          label="Setting"
          name="setting"
          selectedPage={selectedPage}
          icon={<IoSettingsOutline className="text-[20px]" />}
        />
        <Menu
          onClick={() => {
            setSelectedPage("upload-statement")
            navigate("/upload-statement");
            if (isMobile()) fn_controlSidebar();
          }}
          label="Upload Statement"
          name="upload-statement"
          selectedPage={selectedPage}
          icon={<TbBookUpload className="text-[20px]" />}
        />
      </div>
      <div
        onClick={fn_logout}
        className="flex border-t gap-[15px] items-center py-[14px] px-[20px] cursor-pointer absolute bottom-0 w-full"
      >
        <div className="text-[rgba(105,155,247,1)]"><LuLogOut className="text-[20px] rotate-180" /></div>
        <p className="text-[14px] font-[600] text-gray-500">Logout</p>
      </div>
    </div>
  );
};

export default SideBar;

const Menu = ({ label, name, icon, onClick, selectedPage }) => {
  return (
    <div
      className={`flex border-b gap-[15px] items-center py-[14px] px-[20px] cursor-pointer ${name === selectedPage && "bg-blue-50"}`}
      onClick={onClick}
    >
      <div className="text-[rgba(105,155,247,1)]">{icon}</div>
      <p className="text-[14px] font-[600] text-gray-500">{label}</p>
    </div>
  );
};
