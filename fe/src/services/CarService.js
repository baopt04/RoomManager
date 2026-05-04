import axiosInstance from "./AxiosInstance";
const BASE_URL = "/admin/car";

const getAllCar = async (token) => {
    try {
        const response =await axiosInstance.get(`${BASE_URL}/getAll`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        console.log("Chekc service water" , response.data);
        
        return response.data;
    } catch (error) {
        throw error;
    }

}
const createCar = async (token, values) => {
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

const detailCar = async (token, id) => {
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
const updateCar = async (token, id, values) => {
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
const deleteCar = async(token , id) => {
    try {
        const response = await axiosInstance.delete(`${BASE_URL}/delete/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response.data;
    }catch (error) {
        throw error;
    }
}
export default {
    getAllCar,
    createCar,
    detailCar,
    updateCar , 
    deleteCar
}
