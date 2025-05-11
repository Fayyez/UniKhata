import axios from 'axios';

const API_URL = 'http://localhost:4000/api';

const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        console.log('Setting token in request:', token);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('Request headers:', config.headers);
        }
        return config;
    },
    (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        console.log('Response received:', response.config.url, response.status);
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        console.log('Response error:', {
            url: originalRequest.url,
            status: error.response?.status,
            headers: originalRequest.headers
        });

        // If the error is 401 and we haven't tried to refresh the token yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (!refreshToken) {
                    throw new Error('No refresh token available');
                }

                // Create a new axios instance for the refresh request to avoid infinite loop
                const response = await axios.post(`${API_URL}/auth/refresh`, {
                    refreshToken: refreshToken
                });

                const { accessToken, refreshToken: newRefreshToken } = response.data;

                if (!accessToken) {
                    throw new Error('No access token in refresh response');
                }

                // Store the new tokens
                localStorage.setItem('accessToken', accessToken);
                if (newRefreshToken) {
                    localStorage.setItem('refreshToken', newRefreshToken);
                }

                // Update the authorization header for the original request
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;

                // Update the default authorization header for future requests
                axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

                console.log('Token refreshed, retrying request with new token');
                console.log('New request headers:', originalRequest.headers);

                // Retry the original request with the new token
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);
                // If refresh token fails, clear tokens and redirect to login
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                delete axiosInstance.defaults.headers.common['Authorization'];
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;