import axiosInstance from "./AxiosInstance";
const BASE_URL = "/admin/contract";


const getAllcontract = async (token) => {
    try {
        const response = await axiosInstance.get(`${BASE_URL}/getAll`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        
        return response.data;

    } catch (error) {
        
        throw error;
    }
}
const createContract = async (token, contractData) => {
    try {
        const response = await axiosInstance.post(`${BASE_URL}/create`, contractData, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        
        return response.data;
    } catch (error) {
        
        throw error;
    }
}
const detailContract = async (token, id) => {
    try {
        const response = await axiosInstance.get(`${BASE_URL}/detail/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        
        return response.data;
    } catch (error) {
        
        throw error;
    }

}
const updateContract = async (token, id, contractData) => {
    try {
        const response = await axiosInstance.put(`${BASE_URL}/update/${id}`, contractData, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        
        return response.data;
    } catch (error) {
        
        throw error;
    }
}
const historyContract = async (token, id) => {
    try {
        const response = await axiosInstance.get(`${BASE_URL}/history/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        
        return response.data;
    } catch (error) {
        
        throw error;
    }
}

export default {
    getAllcontract,
    createContract,
    detailContract,
    updateContract,
    historyContract,
};

