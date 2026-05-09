import axiosInstance from "./AxiosInstance";
const BASE_URL = "/admin/electricity";

const getAllElectricity = async (token, page = undefined, size = undefined) => {
    try {
        const params = {};
        if (page !== undefined) {
            params.page = page;
            params.size = size !== undefined ? size : 10;
        } else {
            params.size = 1000;
        }
        const response = await axiosInstance.get(`${BASE_URL}/getAll`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: params
        });
        
        if (page !== undefined) return response.data;
        return response.data.content || response.data;
    } catch (error) {
        throw error;
    }

}
const createlectricity = async (token, values) => {
    try {
        const response = await axiosInstance.post(`${BASE_URL}/create`, values, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response.data;
    } catch (error) {
        throw error;
    }
}

const detaillectricity = async (token, id) => {
    try {
        const response = await axiosInstance.get(`${BASE_URL}/detail/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response.data;
    } catch (error) {
        throw error;
    }
}
const updatelectricity = async (token, id, values) => {
    try {
        const response = await axiosInstance.put(`${BASE_URL}/update/${id}`, values, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response.data;
    } catch (error) {
        throw error;
    }
}
const historyElectricity = async (token, id) => {
    try {
        const response = await axiosInstance.get(`${BASE_URL}/history/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response.data;
    } catch (error) {
        throw error;
    }
}
export default {
    getAllElectricity,
    createlectricity,
    detaillectricity,
    updatelectricity , 
    historyElectricity
}

