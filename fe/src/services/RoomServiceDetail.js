import axiosInstance from "./AxiosInstance";
const BASE_URL = "/admin/roomService";

const getAllRoomServiceDetail = async (token) => {
    try {
        const response = await axiosInstance.get(`${BASE_URL}/getAll`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }
        )
        
        return response.data;

    } catch (error) {
        
        throw error;
    }
}

const createRoomServiceDetail = async (token, roomServiceData) => {
    try {
        const response = await axiosInstance.post(`${BASE_URL}/create`, roomServiceData, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        
        return response.data;
    } catch (error) {
        
        throw error;
    }
}
const detailRoomServiceDetail = async (token, id) => {
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
const updateRoomServiceDetail = async (token, id, roomServiceData) => {
    try {
        const response = await axiosInstance.put(`${BASE_URL}/update/${id}`, roomServiceData, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        
        return response.data;
    } catch (error) {
        
        throw error;
    }
}

const deleteRoomServiceDetail = async (token, id) => {
    try {
        const response = await axiosInstance.delete(`${BASE_URL}/delete/${id}`, {
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
    getAllRoomServiceDetail,
    createRoomServiceDetail,
    detailRoomServiceDetail,
    updateRoomServiceDetail,
    deleteRoomServiceDetail,
}

