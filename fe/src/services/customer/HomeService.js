import axiosInstance from "../AxiosInstance";

const BASE_URL = "/api/v1/customer/rooms";


const getAllRooms = async (page = undefined, size = undefined) => {
    try {
        const params = {};
        if (page !== undefined) {
            params.page = page;
            params.size = size !== undefined ? size : 10;
        } else {
            params.size = 1000;
        }
        const response = await axiosInstance.get(BASE_URL, { params: params });
        if (page !== undefined) return response.data;
        return response.data.content || response.data;
    } catch (error) {
        throw error;
    }
};


const getRoomDetail = async (id) => {
    try {
        const response = await axiosInstance.get(`${BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const searchRoomsByAddress = async (address) => {
    try {
        const response = await axiosInstance.get(`${BASE_URL}/search`, {
            params: {
                address: address
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export {
    getAllRooms,
    getRoomDetail,
    searchRoomsByAddress
};

