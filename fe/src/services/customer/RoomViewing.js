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


const getAllRoomViewing = async () => {
    try {
        const response = await axiosInstance.get(BASE_URL);
        return response.data;
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
