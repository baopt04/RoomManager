import axiosInstance from "./AxiosInstance";
const BASE_URL = "/admin/bill";
const BASE_URL_BIll_DETAIL = "/admin/billDetail";


const createBill = async (token , id) => {
    try {
        const response = await axiosInstance.post(`${BASE_URL}/create/${id}`, {} , {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        console.log("Response data:", response.data);
        return response.data;

    } catch (error) {
        console.log("Error fetching customers:", error);
        throw error;
    }
}
const saveBill = async (token, id ,  billData) => {
    try {
        const response = await axiosInstance.post(`${BASE_URL}/saveBill/${id}`, billData, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        console.log("Response data:", response.data);
        return response.data;
    } catch (error) {
        console.log("Error creating customer:", error);
        throw error;
    }
}

const getAllBill = async(token) => {
    try{
        const response = await axiosInstance.get(`${BASE_URL}/getAll` , {
            headers : {
                Authorization : `Bearer ${token}`
            }
        })
        return response.data;
    }catch(error) {
        throw error;
    }
}
const getAllBillNoCreateBill = async(token) => {
    try {
        const response = await axiosInstance.get(`${BASE_URL}/getAllBillNoCreateBill` , {
            headers : {
                Authorization : `Bearer ${token}`
            }
        })
        return response.data;
    }catch(error) {
        throw error;
    }
}
const detailBill = async(token , id) => { 
    try {
        const respones = await axiosInstance.get(`${BASE_URL}/detail/${id}` , {
            headers : {
                Authorization : `Bearer ${token}`
            }
        })
        return respones.data;
    }catch(error) {
        throw error;

    }
}
const detailBillDetail = async(token , id) => {
    try {
        const reponse = await axiosInstance.get(`${BASE_URL_BIll_DETAIL}/detail/${id}` , {
            headers : {
                Authorization : `Bearer ${token}`
            }
        })
        return reponse.data;
    }catch(error) {
        throw error;
    }
}
const update = async(token , id , data) => {
    try {
        const reponse = await axiosInstance.put(`${BASE_URL}/update/${id}` , data , {
            headers : {
                Authorization : `Bearer ${token}`
            }
        })
        return reponse.data;
    }catch(error) {
        throw error;
    }
}
export default {
    createBill , 
    saveBill , 
    getAllBill , 
    getAllBillNoCreateBill , 
    detailBill , 
    detailBillDetail ,
    update
};
