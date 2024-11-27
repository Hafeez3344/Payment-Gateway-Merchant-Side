import "./App.css";
import React, { useEffect, useState } from "react";
import Home from "./Components/Home/Home";
import NavBar from "./Components/NabBar/NavBar";
import Footer from "./Components/Footer/Footer";
import { Routes, Route, useLocation } from "react-router-dom";
import SideBar from "./Components/Sidebar/SideBar";
import TransactionsTable from "./Pages/Transaction-Table/TransactionsTable";
import SupportHelpCenter from "./Pages/Support-Help-Center/SupportHelpCenter";
import MerchantManagement from "./Pages/Merchant-Management/MerchantManagement";
import SystemConfigurationIntegration from "./Pages/System-Configuration-Integration/SystemConfigurationIntegration";
import VerifiedTransactions from "./Pages/Verified-Transactions/VerifiedTransactions";
import ManualVerifiedTransactions from "./Pages/Manual-Verified-Transactions/ManualVerifiedTransactions";
import UnverifiedTransactions from "./Pages/Unverified-Transactions/UnverifiedTransactions";
import DeclinedTransactions from "./Pages/Declined-Transactions/DeclinedTransactions";
import UploadStatement from "./Pages/Upload-Statement/UploadStatement";
import ReportsAndAnalytics from "./Pages/Reports-&-Analytics/ReportsAndAnalytics";
import Login from "./Pages/Admin-Login/Login";

function App() {
  const [hideSidebar, setHideSidebar] = useState(false);
  const [hideNavbar, setHideNavbar] = useState(false);
  const [hideFooter, setHideFooter] = useState(false);
  const [showSidebar, setShowSide] = useState(
    window.innerWidth > 760 ? true : false
  );
  const location = useLocation();
  useEffect(() => {
    if (location.pathname === "/login") {
      setHideSidebar(true);
      setHideNavbar(true);
      setHideFooter(true);
    } else {
      setHideSidebar(false);
      setHideNavbar(false);
      setHideFooter(false);
    }
  }, [location]);
  return (
    <>
      {!hideSidebar && (
        <SideBar showSidebar={showSidebar} setShowSide={setShowSide} />
      )}
      <div>
        {!hideNavbar && (
          <NavBar setShowSide={setShowSide} showSidebar={showSidebar} />
        )}
        <Routes>
          <Route path="/login" element={<Login showSidebar={showSidebar} />} />
          <Route path="/" element={<Home showSidebar={showSidebar} />} />
          <Route
            path="/TransactionsTable"
            element={<TransactionsTable showSidebar={showSidebar} />}
          />
          <Route
            path="/VerifiedTransactions"
            element={<VerifiedTransactions showSidebar={showSidebar} />}
          />
          <Route
            path="/ManualVerifiedTransactions"
            element={<ManualVerifiedTransactions showSidebar={showSidebar} />}
          />
          <Route
            path="/UnverifiedTransactions"
            element={<UnverifiedTransactions showSidebar={showSidebar} />}
          />
          <Route
            path="/DeclinedTransactions"
            element={<DeclinedTransactions showSidebar={showSidebar} />}
          />
          <Route
            path="/MerchantManagement"
            element={<MerchantManagement showSidebar={showSidebar} />}
          />
          <Route
            path="/ReportsAndAnalytics"
            element={<ReportsAndAnalytics showSidebar={showSidebar} />}
          />
          <Route
            path="/SupportHelpCenter"
            element={<SupportHelpCenter showSidebar={showSidebar} />}
          />
          <Route
            path="/SystemConfigurationIntegration"
            element={
              <SystemConfigurationIntegration showSidebar={showSidebar} />
            }
          />
          <Route
            path="/UploadStatement"
            element={<UploadStatement showSidebar={showSidebar} />}
          />
        </Routes>
        {!hideFooter && (
          <Footer showSide={setShowSide} showSidebar={showSidebar} />
        )}
      </div>
    </>
  );
}

export default App;
