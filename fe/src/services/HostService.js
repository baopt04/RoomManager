import axios from "axios";
import axiosInstance from "./AxiosInstance";
const BASE_URL = "/admin/host";

const getAllHosts = async (token) => {
  try {
  const response = await axiosInstance.get(`${BASE_URL}/getAll`, {
    headers: {
        Authorization: `Bearer ${token}`,
    },
  })
  console.log("Response data:", response.data); 
    return response.data;
  } catch (error) {
    console.error("Error fetching hosts:", error);
    throw error; 
  }
};
const createHost = async (token, hostData) => {
  try { 
    const response = await axiosInstance.post(`${BASE_URL}/create`, hostData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;  
  }
};

const detailHost = async (token, id) => {
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

const updateHost = async (token, id, hostData) => {
  try {
    const response = await axiosInstance.put(`${BASE_URL}/update/${id}`, hostData, {
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
  getAllHosts,
  createHost , 
  detailHost,
  updateHost,
};
