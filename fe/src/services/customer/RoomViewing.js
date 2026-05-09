import axiosInstance from "../AxiosInstance";

const BASE_URL = "/api/v1/room-viewing";

const createRoomViewing = async (viewingData) => {
    try {
        const response = await axiosInstance.post(BASE_URL, viewingData);
        return response.data;
    } catch (error) {
        throw error;
    }
};


const updateRoomViewingStatus = async (id, status) => {
    try {
        const response = await axiosInstance.put(
            `${BASE_URL}/${id}/status`,
            null,
            {
                params: {
                    status: status
                }
            }
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};


const getAllRoomViewing = async (page = undefined, size = undefined) => {
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


const getRoomViewingByStatus = async (status) => {
    try {
        const response = await axiosInstance.get(`${BASE_URL}/status/${status}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export {
    createRoomViewing,
    updateRoomViewingStatus,
    getAllRoomViewing,
    getRoomViewingByStatus
};

