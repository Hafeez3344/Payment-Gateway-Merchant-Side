import "./App.css";
import Cookies from "js-cookie";
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
import MerchantLogin from "./Pages/Merchant-Login/MerchantLogin";

function App() {
  // const [hideSidebar, setHideSidebar] = useState(false);
  // const [hideNavbar, setHideNavbar] = useState(false);
  // const [hideFooter, setHideFooter] = useState(false);
  const [authorization, setAuthorization] = useState(
    Cookies.get("token") ? true : false
  );

  const [showSidebar, setShowSide] = useState(
    window.innerWidth > 760 ? true : false
  );
  // const location = useLocation();
  // useEffect(() => {
  //   if (location.pathname === "/login") {
  //     setHideSidebar(true);
  //     setHideNavbar(true);
  //     setHideFooter(true);
  //   } else {
  //     setHideSidebar(false);
  //     setHideNavbar(false);
  //     setHideFooter(false);
  //   }
  // }, [location]);
  return (
    <>
      {authorization && (
        <SideBar showSidebar={showSidebar} setShowSide={setShowSide} />
      )}
      <div>
        {authorization && (
          <NavBar setShowSide={setShowSide} showSidebar={showSidebar} />
        )}
        <Routes>
          <Route path="/login" element={<MerchantLogin authorization={authorization}
                setAuthorization={setAuthorization}/>} />

          <Route path="/" element={<Home authorization={authorization} showSidebar={showSidebar} />} />

          <Route
            path="/transactions-table"
            element={<TransactionsTable authorization={authorization} showSidebar={showSidebar} />}
          />
          <Route
            path="/verified-transactions"
            element={<VerifiedTransactions authorization={authorization} showSidebar={showSidebar} />}
          />
          <Route
            path="/manual-verified"
            element={<ManualVerifiedTransactions authorization={authorization} showSidebar={showSidebar} />}
          />
          <Route
            path="/unverified-transactions"
            element={<UnverifiedTransactions authorization={authorization} showSidebar={showSidebar} />}
          />
          <Route
            path="/declined-transactions"
            element={<DeclinedTransactions authorization={authorization} showSidebar={showSidebar} />}
          />
          <Route
            path="/merchant-management"
            element={<MerchantManagement authorization={authorization} showSidebar={showSidebar} />}
          />
          <Route
            path="/reports-and-analytics"
            element={<ReportsAndAnalytics authorization={authorization} showSidebar={showSidebar} />}
          />
          <Route
            path="/support-help-center"
            element={<SupportHelpCenter authorization={authorization} showSidebar={showSidebar} />}
          />
          <Route
            path="/system-configuration"
            element={
              <SystemConfigurationIntegration authorization={authorization} showSidebar={showSidebar} />
            }
          />
          <Route
            path="/upload-statement"
            element={<UploadStatement authorization={authorization} showSidebar={showSidebar} />}
          />
        </Routes>
        {authorization && <Footer />}
      </div>
    </>
  );
}

export default App;
