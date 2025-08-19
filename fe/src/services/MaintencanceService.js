import axios from "axios";
import axiosInstance from "./AxoisInstance";
const BASE_URL = "/admin/mainten";

const getAllMainTen = async (token) => {
    try {
        const response =await axiosInstance.get(`${BASE_URL}/getAll`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        console.log("Chekc service mainten" , response.data);
        
        return response.data;
    } catch (error) {
        throw error;
    }

}
const createMainTen = async (token, values) => {
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

const detailMainTen = async (token, id) => {
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
const updateMainTen = async (token, id, values) => {
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
const deleteMainTen = async (token , id) => {
    try {
        const response = await axiosInstance.delete(`${BASE_URL}/delete/${id}`, {
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
    getAllMainTen,
    createMainTen,
    detailMainTen,
    updateMainTen , 
    deleteMainTen
}