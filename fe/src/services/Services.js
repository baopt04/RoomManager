import axiosInstance from "./AxiosInstance";
const BASE_URL = "/admin/service"; 

const getAllService = async (token) => {
  try {
  const response = await axiosInstance.get(`${BASE_URL}/getAll`, {
    headers: {
        Authorization: `Bearer ${token}`,
    },
  })
  console.log("Response data:", response.data); 
    return response.data;
  } catch (error) {
    console.error("Error fetching service:", error);
    throw error; 
  }
};
const createService = async (token, serviceData) => {
  try { 
    const response = await axiosInstance.post(`${BASE_URL}/create`, serviceData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;  
  }
};

const detailService = async (token, id) => {
  try {
    const response = await axiosInstance.get(`${BASE_URL}/detail/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;  
  }
};

const updateService = async (token, id, serviceData) => {
  try {
    const response = await axiosInstance.put(`${BASE_URL}/update/${id}`, serviceData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }); 
    return response.data;
  }
  catch (error) {
    throw error;  
  } 
}
export default {
  getAllService,
  createService , 
  detailService,
  updateService,
};
