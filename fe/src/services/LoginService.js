import axios from "axios";

const BASE_URL = 'http://localhost:8080';


const loginRoom = async (values) => {
    try {
        const response = await axios.post(
            `${BASE_URL}/public/login`,
            {
                email: values.email,
                password: values.password
            },
            {
                withCredentials: true
            }
        );
        return response.data;
    } catch (error) {
        throw error;
    }
}

const changePassword = async(email , passwordOld , passwordNew) => {
    try {
        const response = await axios.post(`${BASE_URL}/public/change-password/${email}` , passwordOld , passwordNew) 
        return response.data;
    }catch (error){
        throw error;
    }
}
export default {
loginRoom , 
changePassword
}