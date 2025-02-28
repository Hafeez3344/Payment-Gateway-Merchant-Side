import axios from "axios";
import Cookies from "js-cookie";
import TextArea from "antd/es/input/TextArea";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { Pagination, Modal, Input, Select, Button, notification } from "antd";

import { FiEye } from "react-icons/fi";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { FaExclamationCircle } from "react-icons/fa";
import BACKEND_URL, { fn_getBankByAccountTypeApi } from "../../api/api";

const Withdraw = ({ setSelectedPage, authorization, showSidebar }) => {

    const navigate = useNavigate();
    const [banks, setBanks] = useState([]);
    const [exchanges, setChanges] = useState([])
    const containerHeight = window.innerHeight - 120;
    const [transactions, setTransactions] = useState([]);
    const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);

    const [note, setNote] = useState("");
    const [exchange, setExchange] = useState(null);
    const [exchangeData, setExchangeData] = useState({});
    const [selectedBank, setSelectedBank] = useState(null);
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [merchantWallet, setMerchantWallet] = useState({});

    useEffect(() => {
        window.scroll(0, 0);
        if (!authorization) {
            navigate("/login");
            return;
        }
        setSelectedPage("withdraw");
        fn_getMerchantBanks();
        fn_getExchanges();
        fn_getWithdraws();
        fn_merchantWallet();
    }, []);

    useEffect(() => {
        setNote("");
        setExchange(null);
        setSelectedBank(null);
        setWithdrawAmount('');
    }, [withdrawModalOpen])

    useEffect(() => {
        if (exchange) {
            setExchangeData(exchanges?.find((e) => e?.value === exchange));
        }
    }, [exchange]);

    const fn_getMerchantBanks = async () => {
        const response = await fn_getBankByAccountTypeApi("");
        if (response?.status) {
            setBanks(response?.data?.data?.map((item) => {
                return { value: item?._id, label: `${item?.accountType === "upi" ? `UPI - ${item?.iban}` : `${item?.bankName} - ${item?.iban}`}` }
            }));
        }
    };

    const fn_getExchanges = async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}/exchange/get`)
            if (response?.status === 200) {
                setChanges(response?.data?.data?.map((item) => {
                    return { value: item?._id, label: item?.currency, rate: item?.currencyRate, charges: item?.charges }
                }))
            }
        } catch (error) {
            console.log("error while fetching exchange ", error);
        }
    };

    const fn_getWithdraws = async () => {
        try {
            const token = Cookies.get("merchantToken");
            const response = await axios.get(`${BACKEND_URL}/withdraw/getAll?type=merchant`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            if (response?.status === 200) {
                setTransactions(response?.data?.data);
            }
        } catch (error) {
            console.log("error while withdraws get ", error);
        }
    };

    const fn_merchantWallet = async () => {
        try {
            const token = Cookies.get("merchantToken");
            const response = await axios.get(`${BACKEND_URL}/ledger/withdrawData`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            if (response?.status === 200) {
                setMerchantWallet(response?.data);
            }
        } catch (error) {
            console.log(`error while getting wallet `, error);
        }
    }

    const handleWithdrawRequest = () => {
        setWithdrawModalOpen(true);
    };

    const handleWithdrawSubmit = async () => {
        if (withdrawAmount === "" || withdrawAmount == 0 || exchange === "") {
            return notification.error({
                message: "Error",
                description: "Enter Amount to Withdraw",
                placement: "topRight",
            });
        }
        if (!exchange) {
            return notification.error({
                message: "Error",
                description: "Select Exchange",
                placement: "topRight",
            });
        }
        if (exchange === "67c1e65de5d59894e5a19435" && banks?.length === 0) {
            return notification.error({
                message: "Error",
                description: "First Add Bank",
                placement: "topRight",
            });
        }
        if (exchange === "67c1e65de5d59894e5a19435" && !selectedBank) {
            return notification.error({
                message: "Error",
                description: "Select Bank",
                placement: "topRight",
            });
        }
        if (merchantWallet?.pendingAmount < parseFloat(withdrawAmount)) {
            return notification.error({
                message: "Error",
                description: "Not Enough Balance",
                placement: "topRight",
            });
        }
        const data = {
            amount: ((parseFloat(withdrawAmount) - parseFloat(exchangeData?.charges)) * parseFloat(exchangeData?.rate)).toFixed(2),
            withdrawBankId: exchange === "67c1e65de5d59894e5a19435" ? selectedBank : null,
            note: note,
            exchangeId: exchange,
            amountINR: withdrawAmount
        };
        try {
            const token = Cookies.get("merchantToken");
            const response = await axios.post(`${BACKEND_URL}/withdraw/create`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            if (response?.status === 200) {
                fn_getWithdraws();
                fn_merchantWallet();
                setWithdrawModalOpen(false);
                notification.success({
                    message: "Success",
                    description: "Withdraw Request Created!",
                    placement: "topRight",
                });
            }
        } catch (error) {
            console.log("error while creating withdraw request ", error);
            notification.error({
                message: "Error",
                description: error?.response?.data?.message || "Network Error",
                placement: "topRight",
            });
        }
    };

    return (
        <>
            <div
                style={{ minHeight: `${containerHeight}px` }}
                className={`bg-gray-100 transition-all duration-500 ${showSidebar ? "pl-0 md:pl-[270px]" : "pl-0"}`}
            >
                <div className="p-7">
                    <div className="flex flex-col md:flex-row gap-[12px] items-center justify-between mb-4">
                        <h1 className="text-[25px] font-[500]">Withdraw Transaction</h1>
                        <p className="text-[#7987A1] text-[13px] md:text-[15px] font-[400]">
                            Dashboard - Data Table
                        </p>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                        <div className="flex flex-col md:flex-row items-center justify-between pb-3">
                            <div>
                                <p className="text-black font-medium text-lg">
                                    List of withdraw Transaction
                                </p>

                            </div>
                            <Button type="primary" onClick={handleWithdrawRequest}>
                                Withdraw Request
                            </Button>
                        </div>
                        <div className="w-full border-t-[1px] border-[#DDDDDD80] hidden sm:block mb-4"></div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full border">
                                <thead>
                                    <tr className="bg-[#ECF0FA] text-left text-[12px] text-gray-700">
                                        <th className="p-4 text-nowrap">Sr No.</th>
                                        <th className="p-4">DATE</th>
                                        <th className="p-4 text-nowrap">Amount</th>
                                        <th className="p-4 text-nowrap">Exchange</th>
                                        <th className="pl-8">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions?.length > 0 ? transactions?.map((transaction, index) => (
                                        <tr key={transaction?._id} className="text-gray-800 text-sm border-b">
                                            <td className="p-4 text-[13px] font-[600] text-[#000000B2]">{index + 1}</td>
                                            <td className="p-4 text-[13px] font-[600] text-[#000000B2] whitespace-nowrap">
                                                {new Date(transaction?.createdAt).toDateString()},{" "}
                                                {new Date(transaction?.createdAt).toLocaleTimeString()}
                                            </td>
                                            <td className="p-4 text-[13px] font-[700] text-[#000000B2]">{transaction?.amount} {transaction?.exchangeId?._id === "67c1cb2ffd672c91b4a769b2" ? "INR" : transaction?.exchangeId?._id === "67c1e65de5d59894e5a19435" ? "INR" : transaction?.exchangeId?.currency}</td>
                                            <td className="p-4 text-[13px] font-[700] text-[#000000B2]">{transaction?.exchangeId?.currency}</td>
                                            <td className="p-4 text-[13px] font-[500]">
                                                <span className={`px-2 py-1 rounded-[20px] text-nowrap text-[11px] font-[600] min-w-20 flex items-center justify-center${transaction?.status === "Decline" ? "bg-[#FF7A8F33] text-[#FF002A]" :
                                                    transaction?.status === "Pending" ? "bg-[#FFC70126] text-[#FFB800]" :
                                                        "bg-[#10CB0026] text-[#0DA000]"}`}>
                                                    {transaction?.status}
                                                </span>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={8} className="text-center w-full text-gray-600 italic py-[15px] text-[14px] font-[500]"><FaExclamationCircle className="inline-block text-[20px] mt-[-4px] me-[7px]" />No Transaction Found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                title="Withdraw Request"
                open={withdrawModalOpen}
                onOk={handleWithdrawSubmit}
                onCancel={() => setWithdrawModalOpen(false)}
                okText="Submit"
                cancelText="Cancel"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Amount
                        </label>
                        <Input
                            prefix={<FaIndianRupeeSign />}
                            type="number"
                            placeholder="Enter amount"
                            value={withdrawAmount}
                            onChange={(e) => setWithdrawAmount(e.target.value)}
                        />
                        <p className="text-gray-500 text-[13px] font-[500]">Avaiable for Withdraw: <span className="text-green-500">{merchantWallet?.pendingAmount || 0} INR</span></p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Exchange
                        </label>
                        <Select
                            style={{ width: '100%' }}
                            placeholder="Select Exchange"
                            value={exchange}
                            onChange={(e) => setExchange(e)}
                            options={exchanges}
                        />
                    </div>
                    {exchange && (
                        <div>
                            <p className="text-[12px] font-[500] flex items-center"><span className="text-gray-400 w-[150px] block">Exchange Rate:</span>{" "}1 INR = {exchangeData?.rate} {exchangeData?.label}</p>
                            <p className="text-[12px] font-[500] flex items-center"><span className="text-gray-400 w-[150px] block">Exchange Charges:</span>{" "}{exchangeData?.charges} INR</p>
                            <p className="text-[13px] font-[500] flex items-center text-green-500"><span className="text-gray-500 w-[150px] block">Withdrawal Amount:</span>{" "}{((parseFloat(withdrawAmount) - parseFloat(exchangeData?.charges)) * parseFloat(exchangeData?.rate)).toFixed(2)} {exchangeData?.label === "Bank/UPI" ? "INR" : exchangeData?.label === "By Cash" ? "INR" : exchangeData?.label}</p>
                        </div>
                    )}
                    {exchange === "67c1e65de5d59894e5a19435" && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Select Bank
                            </label>
                            <Select
                                style={{ width: '100%' }}
                                placeholder="Select Your Bank"
                                onChange={(value) => setSelectedBank(value)}
                                value={selectedBank}
                                options={banks}
                            />
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Note
                        </label>
                        <TextArea
                            placeholder="Write anything about Transaction"
                            autoSize={{ minRows: 4, maxRows: 8 }}
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                        />
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default Withdraw;
