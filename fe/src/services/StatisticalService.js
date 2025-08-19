import axios from "axios";
import axiosInstance from "./AxoisInstance";
const BASE_URL = "/admin/statistical"; 

const getTotalPrice = async (token) => {
  try {
  const response = await axiosInstance.get(`${BASE_URL}/revenue`, {
    headers: {
        Authorization: `Bearer ${token} `,
    },
  })
  console.log("Response data:", response.data); 
    return response.data;
  } catch (error) {
    console.error("Error fetching hosts:", error);  
    throw error; 
  }
};

const getTotalPriceMother = async (token) => {
  try {
    const response = await axiosInstance.get(`${BASE_URL}/getTotalPriceMonth`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching total price:", error);
    throw error;
  }
}


const getListTotalPriceForMother = async (token) => {
try {
  const reponse = await axiosInstance.get(`${BASE_URL}/list/getTotalPriceForMonth` , {
    headers : {
      Authorization : `Bearer ${token}`,
    } ,
  });
  return reponse.data;
} catch (error) {
  console.error("Error fetching total price for month:", error);
  throw error;
}
}
const searchHistoryRoom = async (token , id ) => {
  try {
    const reponse = await axiosInstance.get(`${BASE_URL}/searchRoomHistoryByIdRoom/${id}` , {
      headers : {
        Authorization : `Bearer ${token}`,
      } ,
    });
    return reponse.data;
  }catch(error) {
    console.error("Error fetching room history by ID:", error);
    throw error;
  }
}

export default {
  getTotalPrice,
 getTotalPriceMother , 
 getListTotalPriceForMother , 
 searchHistoryRoom
};