import "./App.css";
import Cookies from "js-cookie";
import { Routes, Route } from "react-router-dom";
import React, { useEffect, useState } from "react";

import Home from "./Components/Home/Home";
import NavBar from "./Components/NabBar/NavBar";
import Footer from "./Components/Footer/Footer";
import SideBar from "./Components/Sidebar/SideBar";
import MerchantLogin from "./Pages/Merchant-Login/MerchantLogin";
import UploadStatement from "./Pages/Upload-Statement/UploadStatement";
import TransactionsTable from "./Pages/Transaction-Table/TransactionsTable";
import SupportHelpCenter from "./Pages/Support-Help-Center/SupportHelpCenter";
import MerchantManagement from "./Pages/Merchant-Management/MerchantManagement";
import ReportsAndAnalytics from "./Pages/Reports-&-Analytics/ReportsAndAnalytics";
import SystemConfigurationIntegration from "./Pages/System-Configuration-Integration/SystemConfigurationIntegration";
import Staff from "./Pages/Staff-Page/Staff";
import DirectPaymentPage from "./Pages/Direct-Payment-Page/DirectPaymentPage";
import NotVerfiedBar from "./Components/NotVerifiedBar/page";
import ApprovalPoints from "./Pages/ApprovalPoints/ApprovalPoints";

function App() {
  const [selectedPage, setSelectedPage] = useState("");
  const [permissionsData, setPermissionsData] = useState(
    JSON.parse(localStorage.getItem("permissionsData")) || {}
  );
  const [loginType, setLoginType] = useState(Cookies.get("loginType") || "");

  const [showSidebar, setShowSide] = useState(
    window.innerWidth > 760 ? true : false
  );
  const [authorization, setAuthorization] = useState(
    Cookies.get("merchantToken") ? true : false
  );
  const [merchantVerified, setMerchantVerified] = useState(
    localStorage.getItem("merchantVerified") === "true"
      ? true
      : localStorage.getItem("merchantVerified") === "false"
      ? false
      : false
  );

  useEffect(() => {
    if (window.location.pathname === "/login") {
      setMerchantVerified(true);
    }
  }, []);

  return (
    <>
      {!merchantVerified && <NotVerfiedBar />}
      {authorization && (
        <SideBar
          merchantVerified={merchantVerified}
          showSidebar={showSidebar}
          setShowSide={setShowSide}
          setAuthorization={setAuthorization}
          selectedPage={selectedPage}
          setSelectedPage={setSelectedPage}
          setMerchantVerified={setMerchantVerified}
          loginType={loginType}
          permissionsData={permissionsData}
        />
      )}
      <div>
        {authorization && (
          <NavBar setShowSide={setShowSide} showSidebar={showSidebar} />
        )}
        <Routes>
          <Route
            path="/login"
            element={
              <MerchantLogin
                authorization={authorization}
                setAuthorization={setAuthorization}
                setMerchantVerified={setMerchantVerified}
                loginType={loginType}
                setGlobalLoginType={setLoginType}
                setPermissionsData={setPermissionsData}
              />
            }
          />

          <Route
            path="/"
            element={
              <Home
                setSelectedPage={setSelectedPage}
                authorization={authorization}
                showSidebar={showSidebar}
                permissionsData={permissionsData}
                loginType={loginType}
              />
            }
          />

          <Route
            path="/transactions-table"
            element={
              <TransactionsTable
                setSelectedPage={setSelectedPage}
                authorization={authorization}
                showSidebar={showSidebar}
                permissionsData={permissionsData}
                loginType={loginType}
              />
            }
          />
          <Route
            path="/merchant-management"
            element={
              <MerchantManagement
                setSelectedPage={setSelectedPage}
                authorization={authorization}
                showSidebar={showSidebar}
              />
            }
          />

          <Route
            path="/reports-and-analytics"
            element={
              <ReportsAndAnalytics
                setSelectedPage={setSelectedPage}
                authorization={authorization}
                showSidebar={showSidebar}
              />
            }
          />

          <Route
            path="/support-help-center"
            element={
              <SupportHelpCenter
                setSelectedPage={setSelectedPage}
                authorization={authorization}
                showSidebar={showSidebar}
              />
            }
          />

          <Route
            path="/system-configuration"
            element={
              <SystemConfigurationIntegration
                setSelectedPage={setSelectedPage}
                authorization={authorization}
                showSidebar={showSidebar}
                setMerchantVerified={setMerchantVerified}
              />
            }
          />

          <Route
            path="/upload-statement"
            element={
              <UploadStatement
                setSelectedPage={setSelectedPage}
                authorization={authorization}
                showSidebar={showSidebar}
              />
            }
          />

          <Route
            path="/staff"
            element={
              <Staff
                setSelectedPage={setSelectedPage}
                authorization={authorization}
                showSidebar={showSidebar}
              />
            }
          />
          <Route
            path="/direct-payment-page"
            element={
              <DirectPaymentPage
                setSelectedPage={setSelectedPage}
                authorization={authorization}
                showSidebar={showSidebar}
                permissionsData={permissionsData}
                loginType={loginType}
              />
            }
          />
          <Route
            path="/approval-points"
            element={
              <ApprovalPoints
                setSelectedPage={setSelectedPage}
                authorization={authorization}
                showSidebar={showSidebar}
                permissionsData={permissionsData}
                loginType={loginType}
              />
            }
          />
        </Routes>
        {authorization && <Footer />}
      </div>
    </>
  );
}

export default App;
