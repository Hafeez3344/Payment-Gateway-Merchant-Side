import React from "react";
import logo from "../../assets/logo.png";
import { MdOutlineDashboard } from "react-icons/md";
import { PiNotebook } from "react-icons/pi";
import { FaRegCircleUser } from "react-icons/fa6";
import { FaHeadphones } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { TbBookUpload } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { IoAnalytics } from "react-icons/io5";

const SideBar = ({ showSidebar, setShowSide }) => {
  const fn_controlSidebar = () => {
    setShowSide(!showSidebar);
  };

  const navigate = useNavigate();

  const isMobile = () => window.innerWidth < 1024; 

  return (
    <div
      className={`fixed w-[270px] h-[100vh] bg-white border-r transition-all duration-500 ${
        showSidebar ? "left-0" : "left-[-270px]"
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
            navigate("/");
            if (isMobile()) fn_controlSidebar(); 
          }}
          label="Dashboard"
          icon={<MdOutlineDashboard className="text-[20px]" />}
        />
        <Menu
          onClick={() => {
            navigate("/transactions-table");
            if (isMobile()) fn_controlSidebar();
          }}
          label="Transaction History"
          icon={<PiNotebook className="text-[20px]" />}
        />
        <Menu
          onClick={() => {
            navigate("/merchant-management");
            if (isMobile()) fn_controlSidebar();
          }}
          label="Merchant Profile"
          icon={<FaRegCircleUser className="text-[20px]" />}
        />
        <Menu
          onClick={() => {
            navigate("/reports-and-analytics");
            if (isMobile()) fn_controlSidebar();
          }}
          label="Reports & Analytics"
          icon={<IoAnalytics className="text-[20px]" />}
        />
        <Menu
          onClick={() => {
            navigate("/support-help-center");
            if (isMobile()) fn_controlSidebar();
          }}
          label="Support / Help Center"
          icon={<FaHeadphones className="text-[20px]" />}
        />
        <Menu
          onClick={() => {
            navigate("/system-configuration");
            if (isMobile()) fn_controlSidebar();
          }}
          label="Setting"
          icon={<IoSettingsOutline className="text-[20px]" />}
        />
          <Menu
          onClick={() => {
            navigate("/upload-statement");
            if (isMobile()) fn_controlSidebar();
          }}
          label="Upload Statement"
          icon={<TbBookUpload className="text-[20px]" />}
        />
      </div>
    </div>
  );
};

export default SideBar;

const Menu = ({ label, icon, onClick }) => {
  return (
    <div
      className="flex border-b gap-[15px] items-center py-[14px] px-[20px] cursor-pointer"
      onClick={onClick}
    >
      <div className="text-[rgba(105,155,247,1)]">{icon}</div>
      <p className="text-[14px] font-[600] text-gray-500">{label}</p>
    </div>
  );
};
