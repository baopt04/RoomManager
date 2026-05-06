import axiosInstance from "./AxiosInstance";
const BASE_URL = "/admin/customer";


const getAllCustomers = async (token) => {
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
const createCustomer = async (token, customerData) => {
    try {
        const response = await axiosInstance.post(`${BASE_URL}/create`, customerData, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        
        return response.data;
    } catch (error) {
        
        throw error;
    }
}
const detailCustomer = async (token, id) => {
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
const updateCustomer = async (token, id, customerData) => { 
    try {
        const response = await axiosInstance.put(`${BASE_URL}/update/${id}`, customerData, {
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
    getAllCustomers,
    createCustomer,
    detailCustomer,
    updateCustomer,
};

