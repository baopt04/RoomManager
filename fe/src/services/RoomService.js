import axiosInstance from "./AxiosInstance";
const BASE_URL = "/admin/room";

const getAllRooms = async (token, page = undefined, size = undefined) => {
    try {
        const params = {};
        if (page !== undefined) {
            params.page = page;
            params.size = size !== undefined ? size : 10;
        } else {
            // For legacy calls expecting an array of all rooms, ask for a large size
            params.size = 1000;
        }
        
        const response = await axiosInstance.get(`${BASE_URL}/getAll`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: params
        });
        
        // If caller passes page parameter, they expect the paginated object.
        if (page !== undefined) {
            return response.data;
        }
        
        // Otherwise, they expect a simple array
        return response.data.content || response.data;

    } catch (error) {
        
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
        
        return response.data;
    } catch (error) {
        
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
        
        return response.data;
    } catch (error) {
        
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
        
        return response.data;
    } catch (error) {
        
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
        
        return response.data;
    } catch (error) {
        
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

const getMonthlyBillingSummary = async (token, houseForRentId, month, year) => {
    try {
        const response = await axiosInstance.get(`${BASE_URL}/monthly-billing-summary`, {
            params: { houseForRentId, month, year },
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

const exportMonthlyBilling = async (token, houseForRentId, month, year) => {
    try {
        const response = await axiosInstance.get(`${BASE_URL}/export-monthly-billing`, {
            params: { houseForRentId, month, year },
            headers: { Authorization: `Bearer ${token}` },
            responseType: 'blob'
        });
        return response;
    } catch (error) {
        throw error;
    }
};

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
    getAllStatusRoom,
    findByCustomerId,
    getMonthlyBillingSummary,
    exportMonthlyBilling
}

