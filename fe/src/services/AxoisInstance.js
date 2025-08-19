import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080',
    withCredentials: true,
});

// Biến để kiểm soát refresh process
let isRefreshing = false; // Kiểm tra xem refresh có tồn tại hay không
let failedQueue = []; // queue chứa các request bị 401 đang chờ


const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error); // tất cả request fails
        } else {
            prom.resolve(token); // tất cả request được token mới
        }
    });
    
    failedQueue = []; // clean queue
};

// Request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`; // gán token
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) { // điều kiện để refresh
            
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return axiosInstance(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                console.log('🔄 Đang refresh token...');
                
                const res = await axios.post(
                    'http://localhost:8080/public/refresh-token', 
                    {}, 
                    { withCredentials: true }
                );

                const newAccessToken = res.data.accessToken;
                localStorage.setItem('token', newAccessToken);
                
                if (res.data.name) {
                    localStorage.setItem('userName', res.data.name);
                }
                if (res.data.email) {
                    localStorage.setItem('email', res.data.email);
                }


                processQueue(null, newAccessToken);

                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return axiosInstance(originalRequest);

            } catch (refreshError) {
                console.log('❌ Refresh token thất bại:', refreshError);
                
                processQueue(refreshError, null);
                
                localStorage.removeItem('token');
                localStorage.removeItem('email');
                localStorage.removeItem('userName');
                
                setTimeout(() => {
                    window.location.href = '/login';
                }, 500);
                
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;