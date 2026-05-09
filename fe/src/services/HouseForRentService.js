import axiosInstance from "./AxiosInstance";
const BASE_URL = "/admin/houseForRent";

const getAllHouseForRent = async (token, page = undefined, size = undefined) => {
  try {
    const params = {};
    if (page !== undefined) {
      params.page = page;
      params.size = size !== undefined ? size : 10;
    } else {
      params.size = 1000;
    }
    const response = await axiosInstance.get(`${BASE_URL}/getAll`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: params
    });
    if (page !== undefined) return response.data;
    return response.data.content || response.data;
  } catch (error) {
    console.error("Error fetching houses for rent:", error);
    throw error;
  }
};
const createHouseForRent = async (token, houseData) => {
  try {
    const response = await axiosInstance.post(`${BASE_URL}/create`, houseData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const detailHouseForRent = async (token, id) => {
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

const updateHouseForRent = async (token, id, hostData) => {
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
  getAllHouseForRent,
  createHouseForRent,
  detailHouseForRent,
  updateHouseForRent,
};

