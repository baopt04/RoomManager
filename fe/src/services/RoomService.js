import axiosInstance from "./AxiosInstance";
const BASE_URL = "/admin/room";

const getAllRooms = async (token) => {
    try {
        const response = await axiosInstance.get(`${BASE_URL}/getAll`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }
        )
        console.log("Response data:", response.data);
        return response.data;

    } catch (error) {
        console.log("Error fetching rooms:", error);
        throw error;
    }
}

const createRoom = async (token, roomData) => {
    try {
        const response = await axiosInstance.post(`${BASE_URL}/create`, roomData, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        console.log("Response data:", response.data);
        return response.data;
    } catch (error) {
        console.log("Error creating room:", error);
        throw error;
    }
}
const detailRoom = async (token, id) => {
    try {
        const response = await axiosInstance.get(`${BASE_URL}/detail/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        console.log("Response data detail:", response.data);
        return response.data;
    } catch (error) {
        console.log("Error fetching room details:", error);
        throw error;
    }

}
const updateRoom = async (token, id, roomData) => {
    try {
        const response = await axiosInstance.put(`${BASE_URL}/update/${id}`, roomData, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        console.log("Response data:", response.data);
        return response.data;
    } catch (error) {
        console.log("Error updating room:", error);
        throw error;
    }
}

const getRoomNoPayMent = async (token, mother, year) => {
    try {
        const response = await axiosInstance.get(`${BASE_URL}/findByRoomNoPayMent`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                mother: mother,
                year: year
            }
        })
        console.log("Response data room no paymnet ", response.data);
        return response.data;
    } catch (error) {
        console.log("Error fetching room no payment:", error);
        throw error;
    }
}

const getTotalPriceRoom = async (token, id) => {
    try {
        const repsonse = await axiosInstance.get(`${BASE_URL}/findTotalPriceRoom`, {
            params: {
                id: id
            },
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return repsonse.data

    } catch (error) {
        throw error;
    }
}

const detailImage = async (token, id) => {
    try {
        const reponse = await axiosInstance.get(`${BASE_URL}/findAllImages/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return reponse.data;
    } catch (error) {
        throw error;
    }
}

const findAllHouseForRentInRom = async (token, idHouseForRent, idCustomer) => {
    try {
        const response = await axiosInstance.get(`${BASE_URL}/findAllHouseForRent`, {
            params: {
                idHouseForRent: idHouseForRent,
                idCustomer: idCustomer
            },
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};
const findAllRoomHistory = async (token, id) => {
    try {
        const response = await axiosInstance.get(`${BASE_URL}/findAllRoomHistory`, {
            params: {
                idRoom : id
            },
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};
const getAllStatusRoom = async (token) => {
    try {
        const reponse = await axiosInstance.get(`${BASE_URL}/getAllStatus`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }); 
        return reponse.data;
    }catch(error) {
        throw error;
    }
}
const findByCustomerId = async (token , id ) => {
    try {
        const response = await axiosInstance.get(`${BASE_URL}/findByIdCustomer/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;   
    }catch(error) {
        console.error("Error fetching rooms by customer ID:", error);
        throw error;
    }
}

export default {
    getAllRooms,
    createRoom,
    detailRoom,
    updateRoom,
    getRoomNoPayMent,
    getTotalPriceRoom,
    detailImage ,
    findAllHouseForRentInRom , 
    findAllRoomHistory , 
    getAllStatusRoom , 
    findByCustomerId
}
