import axiosInstance from "./AxiosInstance";
const BASE_URL = "/admin";

const getAllAdmin = async (token) => {
    try {
        const response = await axiosInstance.get(`${BASE_URL}/getAllAdmin`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response.data
    } catch (error) {
        throw error;
    }
}
const createAdmin = async (token, adminData) => {
    try {
        const response = await axiosInstance.post(`${BASE_URL}/create`, adminData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response.data;
    } catch (error) {
        throw error;
    }

}
const updateAdmin = async (token, adminData, id) => {
    try {
        const response = await axiosInstance.post(`${BASE_URL}/update/${id}`, adminData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response.data;
    } catch (error) {
        throw error;
    }
}
const detailAdmin = async (token, id) => {
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
const lockerAdmin = async (token, id, description) => {
    try {
        const response = await axiosInstance.post(`${BASE_URL}/locker-admin/${id}`, description, {
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
    getAllAdmin,
    createAdmin,
    updateAdmin,
    detailAdmin,
    lockerAdmin
}
