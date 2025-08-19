import axiosInstance from "./AxoisInstance";

const BASE_URL = "/admin/water";

const getAllWater = async () => {
    try {
        const response = await axiosInstance.get(`${BASE_URL}/getAll`);
        console.log("Check service water", response.data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const createWater = async (values) => {
    try {
        const response = await axiosInstance.post(`${BASE_URL}/create`, values);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const detailWater = async (id) => {
    try {
        const response = await axiosInstance.get(`${BASE_URL}/detail/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const updateWater = async (id, values) => {
    try {
        const response = await axiosInstance.put(`${BASE_URL}/update/${id}`, values);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const historyWater = async (id) => {
    try {
        const response = await axiosInstance.get(`${BASE_URL}/history/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export default {
    getAllWater,
    createWater,
    detailWater,
    updateWater,
    historyWater,
};
