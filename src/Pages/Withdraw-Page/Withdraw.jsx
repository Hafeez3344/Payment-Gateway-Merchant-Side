import axios from "axios";
import { FiEye} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { Pagination, Modal, Input,Select, Button } from "antd";
import BACKEND_URL, { fn_deleteTransactionApi, fn_getAllMerchantApi, fn_updateTransactionStatusApi } from "../../api/api";

const Withdraw = ({ setSelectedPage, authorization, showSidebar }) => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [selectedBank, setSelectedBank] = useState(null);
    const containerHeight = window.innerHeight - 120;
    const [selectedTransaction, setSelectedTransaction] = useState(null);


    const staticTransactions = [
        {
            _id: 1,
            trnNo: "TRN001",
            createdAt: "2024-01-20T10:30:00",
            username: "John Doe",
            bankId: { bankName: "HDFC Bank" },
            total: 5000,
            utr: "UTR123456",
            status: "Approved",
            approval: true
        },
        {
            _id: 2,
            trnNo: "TRN002",
            createdAt: "2024-01-20T11:45:00",
            username: "Jane Smith",
            bankId: { bankName: "SBI Bank" },
            total: 3500,
            utr: "UTR789012",
            status: "Pending",
            approval: false
        },
        {
            _id: 3,
            trnNo: "TRN003",
            createdAt: "2024-01-20T09:15:00",
            username: "GUEST",
            bankId: { bankName: "ICICI Bank" },
            total: 7500,
            utr: "UTR345678",
            status: "Decline",
            approval: false
        },
        {
            _id: 1,
            trnNo: "TRN001",
            createdAt: "2024-01-20T10:30:00",
            username: "John Doe",
            bankId: { bankName: "HDFC Bank" },
            total: 5000,
            utr: "UTR123456",
            status: "Approved",
            approval: true
        },
        {
            _id: 2,
            trnNo: "TRN002",
            createdAt: "2024-01-20T11:45:00",
            username: "Jane Smith",
            bankId: { bankName: "SBI Bank" },
            total: 3500,
            utr: "UTR789012",
            status: "Pending",
            approval: false
        },
        {
            _id: 3,
            trnNo: "TRN003",
            createdAt: "2024-01-20T09:15:00",
            username: "GUEST",
            bankId: { bankName: "ICICI Bank" },
            total: 7500,
            utr: "UTR345678",
            status: "Decline",
            approval: false
        }
    ];

    useEffect(() => {
        window.scroll(0, 0);
        if (!authorization) {
            navigate("/login");
            return;
        }
        setSelectedPage("withdraw");
    }, []);

    const handleWithdrawRequest = () => {
        setWithdrawModalOpen(true);
    };

    const handleWithdrawSubmit = () => {
        // Add your withdraw submission logic here
        console.log('Withdraw request submitted:', { amount: withdrawAmount, bank: selectedBank });
        setWithdrawModalOpen(false);
        setWithdrawAmount('');
        setSelectedBank(null);
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
                                        <th className="p-4 text-nowrap">TRN-ID</th>
                                        <th className="p-4">DATE</th>
                                        <th className="p-4 text-nowrap">User Name</th>
                                        <th className="p-4 text-nowrap">BANK NAME</th>
                                        <th className="p-4 text-nowrap">TOTAL AMOUNT</th>
                                        <th className="p-4">UTR#</th>
                                        <th className="pl-8">Status</th>
                                        <th className="pl-7">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {staticTransactions.map((transaction) => (
                                        <tr key={transaction._id} className="text-gray-800 text-sm border-b">
                                            <td className="p-4 text-[13px] font-[600] text-[#000000B2]">{transaction.trnNo}</td>
                                            <td className="p-4 text-[13px] font-[600] text-[#000000B2] whitespace-nowrap">
                                                {new Date(transaction.createdAt).toDateString()},{" "}
                                                {new Date(transaction.createdAt).toLocaleTimeString()}
                                            </td>
                                            <td className="p-4 text-[13px] font-[700] text-[#000000B2]">{transaction.username}</td>
                                            <td className="p-4 text-[13px] font-[700] text-[#000000B2]">{transaction.bankId.bankName}</td>
                                            <td className="p-4 text-[13px] font-[700] text-[#000000B2]">
                                                <FaIndianRupeeSign className="inline-block mt-[-1px]" />{" "}
                                                {transaction.total}
                                            </td>
                                            <td className="p-4 text-[12px] font-[700] text-[#0864E8]">{transaction.utr}</td>
                                            <td className="p-4 text-[13px] font-[500]">
                                                <span className={`px-2 py-1 rounded-[20px] text-nowrap text-[11px] font-[600] min-w-20 flex items-center justify-center${transaction.status === "Decline" ? "bg-[#FF7A8F33] text-[#FF002A]" :
                                                    transaction.status === "Pending" ? "bg-[#FFC70126] text-[#FFB800]" :
                                                        "bg-[#10CB0026] text-[#0DA000]"}`}>
                                                    {transaction.status}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <button
                                                    className="bg-blue-100 text-blue-600 rounded-full px-2 py-2"
                                                    title="View"
                                                    onClick={() => handleViewTransaction(transaction)}
                                                >
                                                    <FiEye />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex flex-col md:flex-row items-center p-4 justify-between space-y-4 md:space-y-0">
                            <p className="text-[13px] font-[500] text-gray-500 text-center md:text-left"></p>
                            <Pagination
                                className="self-center md:self-auto"
                                defaultCurrent={1}
                                total={30}
                            />
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
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Select Bank
                        </label>
                        <Select
                            style={{ width: '100%' }}
                            placeholder="Select your bank"
                            onChange={(value) => setSelectedBank(value)}
                            value={selectedBank}
                            options={[
                                { value: 'hdfc', label: 'HDFC Bank' },
                                { value: 'sbi', label: 'SBI Bank' },
                                { value: 'icici', label: 'ICICI Bank' },
                            ]}
                        />
                    </div>
                </div>
            </Modal>

        </>
    );
};

export default Withdraw;
