import axios from "axios";
import Cookies from "js-cookie";

const BACKEND_URL = "http://localhost:8888";

export const fn_loginMerchantApi = async (data) => {
    try {
        const response = await axios.post(`${BACKEND_URL}/merchant/login`, data);
        console.log(response)
        const token = response?.data?.token;
        const id = response?.data?.data?._id;

        return {
            status: true,
            message: "Merchant Logged in successfully",
            token: token,
            id: id,
        };
    } catch (error) {
        if (error?.response?.status === 400) {
            return { status: false, message: error?.response?.data?.message };
        }
        return { status: false, message: "Network Error" };
    }
};

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


export const fn_updateApiKeys = async (apiKey, secretKey) => {
    console.log(apiKey, secretKey)
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
        console.log(response)
        return {
            status: true,
            message: "API keys updated successfully",
            data: response
        };
    } catch (error) {
        if (error?.response?.status === 400) {
            return { status: false, message: error?.response?.data?.message };
        }
        return { status: false, message: "Network Error" };
    }
};


export const fn_getApiKeys = async () => {
    try {
        const token = Cookies.get("merchantToken");
        const response = await axios.get(`${BACKEND_URL}/merchant/get`,
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


// get All Merchant api

export const fn_getAllMerchantApi = async () => {
    try {
        const token = Cookies.get("merchantToken");
        const response = await axios.get(`${BACKEND_URL}/ledger/getAllMerchant`, {
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




export default BACKEND_URL;