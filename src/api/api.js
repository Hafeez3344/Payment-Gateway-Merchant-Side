import axios from "axios";
import Cookies from "js-cookie";

const BACKEND_URL = "http://192.168.1.21:8888";
export const PDF_READ_URL = "http://127.0.0.1:5000/parse-statement"

// ------------------------------------- Merchant Login api------------------------------------
export const fn_loginMerchantApi = async (data) => {
    try {
        const response = await axios.post(`${BACKEND_URL}/merchant/login`, data);
        console.log(response)
        const token = response?.data?.token;
        const id = response?.data?.data?._id;
        const merchantVerified = response?.data?.data?.verify;
        return {
            status: true,
            message: "Merchant Logged in successfully",
            token: token,
            id: id,
            merchantVerified: merchantVerified
        };
    } catch (error) {
        if (error?.response?.status === 400) {
            return { status: false, message: error?.response?.data?.message };
        }
        return { status: false, message: "Network Error" };
    }
};

// ------------------------------------- Merchant Login History api----------------------------
export const fn_getMerchantLoginHistoryApi = async (MerchantId) => {
    try {
        const token = Cookies.get('merchantToken');
        const response = await axios.get(`${BACKEND_URL}/loginHistory/getAll`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        return {
            status: true,
            message: "Data Fetched Successfully",
            data: response?.data?.data
        };
    } catch (error) {
        if (error?.response?.status === 400) {
            return { status: false, message: error?.response?.data?.message };
        }
        return { status: false, message: "Network Error" };
    }
};

// ------------------------------------- Update Api Keys api------------------------------------
export const fn_updateApiKeys = async (apiKey, secretKey) => {
    try {
        const token = Cookies.get("merchantToken");
        const formData = new FormData;
        formData.append('apiKey', apiKey)
        formData.append('secretKey', secretKey)
        const response = await axios.post(`${BACKEND_URL}/merchant/verify`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        return {
            status: true,
            message: "Merchant Verified Successfully",
            data: response
        };
    } catch (error) {
        if (error?.response?.status === 400) {
            return { status: false, message: error?.response?.data?.message };
        }
        return { status: false, message: "Network Error" };
    }
};

// ------------------------------------- Get API Keys api---------------------------------------
export const fn_getApiKeys = async () => {
    try {
        const merchantId = Cookies.get("merchantId");
        const response = await axios.get(`${BACKEND_URL}/merchant/get/${merchantId}`);
        return { status: true, data: response.data };
    } catch (error) {
        if (error?.response?.status === 400) {
            return { status: false, message: error?.response?.data?.message };
        }
        return { status: false, message: "Network Error" };
    }
};

// ------------------------------------- Get Bank Account api-----------------------------------
export const fn_getBankByAccountTypeApi = async (accountType) => {
    try {
        const token = Cookies.get("merchantToken");
        const response = await axios.get(`${BACKEND_URL}/bank/getAll?accountType=${accountType}`, // accountType="bank","upi"
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        return {
            status: true,
            data: response?.data,
        };
    } catch (error) {
        if (error?.response?.status === 400) {
            return { status: false, message: error?.response?.data?.message };
        }
        return { status: false, message: "Network Error" };
    }
};

// ------------------------------------- Bank Update api----------------------------------------
export const fn_BankUpdate = async (id, data) => {
    try {
        const token = Cookies.get("merchantToken");
        const response = await axios.post(`${BACKEND_URL}/bank/active?id=${id}&accountType=${data?.accountType}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        return {
            status: true,
            data: response.data,
        };
    } catch (error) {
        if (error?.response?.status === 400) {
            return { status: false, message: error?.response?.data?.message };
        }
        return { status: false, message: "Network Error" };
    }
};

// -------------------------------- get All Merchant api----------------------------------------
export const fn_getAllMerchantApi = async (status, pageNumber) => {
    try {
        const token = Cookies.get("merchantToken");
        const response = await axios.get(`${BACKEND_URL}/ledger/getAllMerchant?page=${pageNumber}&status=${status || ""}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
        console.log(response);
        return {
            status: true,
            message: "Merchants show successfully",
            data: response.data,
        };
    } catch (error) {
        console.error(error);

        if (error?.response) {
            return {
                status: false,
                message: error?.response?.data?.message || "An error occurred",
            };
        }
        return { status: false, message: "Network Error" };
    }
};

//----------------------------------Transaction Status api--------------------------------------
export const fn_updateTransactionStatusApi = async (transactionId, data) => {
    try {
        const token = Cookies.get("merchantToken");
        const response = await axios.put(
            `${BACKEND_URL}/ledger/update/${transactionId}`,
            data,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                }
            }
        );

        return {
            status: response?.data?.status === "ok",
            message: response?.data?.message || "Transaction updated successfully",
            data: response?.data,
        };
    } catch (error) {
        console.error(`Error updating transaction status:`, error?.response || error);
        return {
            status: false,
            message: error?.response?.data?.message || "An error occurred",
        };
    }
};

// -----------------------------------Verified Transactions api---------------------------------
export const fn_getAllVerifiedTransactionApi = async (status) => {
    try {
        const token = Cookies.get("merchantToken");
        const response = await axios.get(`${BACKEND_URL}/ledger/cardMerchantData?status=${status}&filter=all`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
        console.log(response);
        return {
            status: true,
            message: "Merchants show successfully",
            data: response.data?.data,
        };
    } catch (error) {
        console.error(error);

        if (error?.response) {
            return {
                status: false,
                message: error?.response?.data?.message || "An error occurred",
            };
        }
        return { status: false, message: "Network Error" };
    }
};

export const fn_getAllTransactionApi = async () => {
    try {
        const token = Cookies.get("merchantToken");
        const response = await axios.get(`${BACKEND_URL}/ledger/cardMerchantData`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
        console.log(response);
        return {
            status: true,
            message: "Merchants show successfully",
            data: response.data?.data,
        };
    } catch (error) {
        console.error(error);

        if (error?.response) {
            return {
                status: false,
                message: error?.response?.data?.message || "An error occurred",
            };
        }
        return { status: false, message: "Network Error" };
    }
};

export const fn_compareTransactions = async (data) => {
    try {
        const token = Cookies.get("merchantToken");
        const response = await axios.post(`${BACKEND_URL}/ledger/compare`, data,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
        return {
            status: true,
            message: "Transaction Verified",
            data: response.data?.data,
        };
    } catch (error) {
        if (error?.response) {
            return {
                status: false,
                message: error?.response?.data?.message || "An error occurred",
            };
        }
        return { status: false, message: "Network Error" };
    }
};

export const fn_deleteTransactionApi = async (id) => {
    try {
        const token = Cookies.get("merchantToken");
        const response = await axios.delete(`${BACKEND_URL}/ledger/delete/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
        return {
            status: true,
            message: "Transaction Deleted",
        };
    } catch (error) {
        if (error?.response) {
            return {
                status: false,
                message: error?.response?.data?.message || "An error occurred",
            };
        }
        return { status: false, message: "Network Error" };
    }
};

export default BACKEND_URL;