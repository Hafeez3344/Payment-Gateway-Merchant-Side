import { Bar } from "react-chartjs-2";
import { GoDotFill } from "react-icons/go";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaCircleExclamation } from "react-icons/fa6";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import { fn_getAllMerchantApi, fn_getAllTransactionApi, fn_getAllVerifiedTransactionApi } from "../../api/api";
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);


const Home = ({ setSelectedPage, authorization, showSidebar }) => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const containerHeight = window.innerHeight - 105;
  const [transactions, setTransactions] = useState([]);
  const [totalTransaction, setTotalTransactions] = useState(0);
  const [declineTransactions, setDeclineTransactions] = useState(0);
  const [verifiedTransactions, setVerifiedTransactions] = useState(0);
  const [unverifiedTransactions, setUnverifiedTransactions] = useState(0);
  const [manualVerifiedTransactions, setManualVerifiedTransactions] = useState(0);

  useEffect(() => {
    window.scroll(0, 0);
    if (!authorization) {
      navigate("/login");
    }
    setSelectedPage("dashboard");

    const fetchTransactions = async () => {
      try {
        console.log("Fetching all transactions...");
        const response = await fn_getAllMerchantApi();
        // console.log("Response from fn_getAllMerchantApi: ", response);
        if (response.status) {
          setTransactions(response?.data?.data || []);
        } else {
          setError(response.message);
        }
      } catch (err) {
        console.error("Error fetching transactions:", err);
        setError("Unable to fetch transactions.");
      } finally {
        setLoading(false);
      }
    };

    const fetchVerifiedTransactions = async () => {
      try {
        const response = await fn_getAllVerifiedTransactionApi("Verified");
        const manualResponse = await fn_getAllVerifiedTransactionApi(
          "Manual Verified"
        );
        const declineResponse = await fn_getAllVerifiedTransactionApi(
          "Decline"
        );
        const unverifiedResponse = await fn_getAllVerifiedTransactionApi(
          "Unverified"
        );
        const total = await fn_getAllTransactionApi();
        setVerifiedTransactions(response?.data || 0);
        setUnverifiedTransactions(unverifiedResponse?.data || 0);
        setManualVerifiedTransactions(manualResponse?.data || 0);
        setDeclineTransactions(declineResponse?.data || 0);
        setTotalTransactions(total?.data || 0);
      } catch (err) {
        console.error("Error fetching verified transactions:", err);
        setError("Unable to fetch verified transactions.");
      }
    };

    fetchTransactions();
    fetchVerifiedTransactions();
  }, [authorization, navigate, setSelectedPage]);

  const data = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Verified",
        data: [
          10300, 15200, 19300, 14500, 5300, 10200, 12200, 7100, 16300, 13500,
          5300, 7400,
        ],
        backgroundColor: "#009666",
        // borderRadius: {
        //   topLeft: 10,
        //   topRight: 10,
        // },
      },
      {
        label: "Manual Varified",
        data: [
          15300, 5200, 17300, 18500, 5300, 17200, 12400, 7100, 14300, 13500,
          5300, 7400,
        ],
        backgroundColor: "#0C67E9",
      },
      {
        label: "Pending",
        data: [
          16300, 15200, 15300, 13500, 15300, 14200, 10200, 10200, 7100, 13500,
          5900, 3300,
        ],
        backgroundColor: "#F67A03",
      },
      {
        label: "Faild",
        data: [
          4500, 4000, 9300, 15000, 4000, 11000, 2000, 8000, 10200, 17400, 15300,
          18800,
        ],
        backgroundColor: "#FF3E5E",
      },
    ],
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          display: false,
        },
      },
    },
    datasets: {
      bar: {
        barPercentage: 0.6,
        categoryPercentage: 0.9,
      },
    },
  };
  return (
    <div
      className={`bg-gray-100 transition-all duration-500 ${
        showSidebar ? "pl-0 md:pl-[270px]" : "pl-0"
      }`}
      style={{ minHeight: `${containerHeight}px` }}
    >
      <div className="p-7">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row gap-[12px] items-center justify-between mb-7">
          <h1 className="text-[25px] font-[500]">Merchant Dashboard</h1>
          <div className="flex space-x-2 text-[12px]">
            <button className="text-white bg-[#0864E8] border w-[70px] sm:w-[70px] p-1 rounded">
              ALL
            </button>
            <button className="text-black border w-[70px] sm:w-[70px] p-1 rounded">
              TODAY
            </button>
            <button className="text-black border w-[70px] sm:w-[70px] p-1 rounded">
              7 DAYS
            </button>
            <button className="text-black border w-[70px] sm:w-[70px] p-1 rounded">
              30 DAYS
            </button>
          </div>
        </div>

        {/* Boxes Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
          <Boxes
            number={verifiedTransactions}
            amount={totalTransaction}
            title={"SYSTEM VERIFIED TRANSACTIONS"}
            bgColor={
              "linear-gradient(to right, rgba(0, 150, 102, 1), rgba(59, 221, 169, 1))"
            }
            link={"/transactions-table?status=Verified"}
          />
          <Boxes
            number={manualVerifiedTransactions}
            amount={totalTransaction}
            title={"MANUAL VERIFIED TRANSACTIONS"}
            bgColor={
              "linear-gradient(to right, rgba(8, 100, 232, 1), rgba(108, 168, 255, 1))"
            }
            link={"/transactions-table?status=Manual Verified"}
          />
          <Boxes
            number={unverifiedTransactions}
            amount={totalTransaction}
            title={"PENDING TRANSACTIONS"}
            bgColor={
              "linear-gradient(to right, rgba(245, 118, 0, 1), rgba(255, 196, 44, 1))"
            }
            link={"/transactions-table?status=Unverified"}
          />
          <Boxes
            number={declineTransactions}
            amount={totalTransaction}
            title={"FAILED TRANSACTIONS"}
            bgColor={
              "linear-gradient(to right, rgba(255, 61, 92, 1), rgba(255, 122, 143, 1))"
            }
            link={"/transactions-table?status=Decline"}
          />
        </div>

        {/* Graph and Recent Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-3">
          {/* Graph Section */}
          <div className="col-span-2 bg-white p-6 mb-4 md:mb-0 md:mr-4 rounded shadow flex-1 h-[100%]">
            <div className="w-full">
              <div className="justify-between items-center mb-4">
                <h2 className="text-[16px] font-[700]">TRANSACTION STATS</h2>
                <p className="text-[11px] font-[500] text-gray-500 mt-1">
                  Order status and tracking. Track your order from ship date to
                  arrival.To begin, enter your order number.
                </p>
                <div className="grid grid-cols-2 gap-4 md:flex md:gap-12 mt-3">
                  <Stat
                    label="System Verified"
                    value="120,750"
                    color="#029868"
                  />
                  <Stat label="Declined" value="56,108" color="#FF3E5E" />
                  <Stat label="Unverified" value="32,894" color="#F67A03" />
                  <Stat
                    label="Manual Verified"
                    value="51,235"
                    color="#0C67E9"
                  />
                </div>
              </div>
              <div className="w-full h-[300px]">
                <Bar data={data} options={options} />
              </div>
            </div>
          </div>
          {/* Recent Transactions Section */}
          <div className="bg-white p-6 rounded shadow w-full flex-1 h-[100%]">
            <h2 className="text-[16px] font-[700]">RECENT TRANSACTIONS</h2>
            <p className="text-[11px] font-[500] text-gray-500 pt-1">
              Customer is an individual or business that purchases the goods or
              services, and the process has evolved to include real-time
              tracking.
            </p>
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <div className="flex items-center space-x-2 mt-2 text-gray-500">
                <FaCircleExclamation className="text-gray-500" />
                <p>{error}</p>
              </div>
            ) : (
              <div>
                {transactions.length > 0 ? (
                  transactions.map((transaction, index) => (
                    <RecentTransaction
                      name={transaction?.bankId?.bankName || "UPI"}
                      utrId={transaction?.utr}
                      status={transaction?.status}
                      amount={`₹${transaction?.amount}`}
                    />
                  ))
                ) : (
                  <p>No transactions found.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Boxes = ({ number, amount, title, bgColor, link }) => (
  <Link
    to={link}
    className="bg-white px-[14px] py-[10px] rounded-[5px] shadow text-white"
    style={{ backgroundImage: bgColor }}
  >
    <h2 className="text-[13px] uppercase font-[500]">{title}</h2>
    <p className="mt-[13px] text-[20px] font-[700]">₹ {number}</p>
    <p className="pt-[3px] text-[13px] font-[500] mb-[7px]">
      Amount: <span className="font-[700]">₹ {amount}</span>
    </p>
  </Link>
);

const Stat = ({ label, value, color }) => (
  <div>
    <p className="text-[15px] font-[700]">₹ {value}</p>
    <div className="flex pt-1 gap-1 items-center">
      <GoDotFill style={{ color }} />
      <p className="text-[12px] font-[500]">{label}</p>
    </div>
  </div>
);

const RecentTransaction = ({ name, utrId, status, color, amount }) => {
  const statusColor = {
    Verified: "#029868",
    Declined: "#FF3F5E",
    "Manual Verified": "#0864E8",
    Unverified: "#F67A03",
  };

  return (
    <div className="flex justify-between items-center py-3 border-b">
      {/* Left Section */}
      <div>
        <p className="text-[15px] font-[600]">{name}</p>
        <div className="flex items-center gap-2 text-[10px] pt-1 text-[#7987A1] font-[600]">
          {/* UTR ID label */}
          <span>UTR ID:</span>
          {/* UTR ID value */}
          <span>{utrId}</span>
          {/* Status with dynamic color */}
          <span
            className="text-[10px] font-[600]"
            style={{ color: statusColor[status] || color }}
          >
            {status}
          </span>
        </div>
      </div>

      {/* Right Section */}
      <div>
        <p className="text-[16px] font-[600]">{amount}</p>
      </div>
    </div>
  );
};

export default Home;
