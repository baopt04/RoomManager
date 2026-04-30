import axios from "axios";
import axiosInstance from "../AxoisInstance";

const BASE_URL = "/api/v1/customer/rooms";


const getAllRooms = async () => {
    try {
        const response = await axiosInstance.get(BASE_URL);
        return response.data;
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