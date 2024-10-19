import appConfig from '../config';
import axios from 'axios';

export const API = axios.create({
    baseURL: appConfig.backend.baseURL,
});

// Function to get token from localStorage or other storage
const getToken = () => {
    return localStorage.getItem('accessToken');
};

// Function to get token expiry time from localStorage
const getTokenExpiry = () => {
    return localStorage.getItem('tokenExpiry');
};

// Set up Axios request interceptor to add the Authorization header
API.interceptors.request.use(
    async (config) => {
        const token = getToken();
        const tokenExpiry = getTokenExpiry();

        // Check if the token is expired (add buffer time for refresh)
        const currentTime = Date.now();
        if (tokenExpiry && currentTime >= tokenExpiry) {
            // Token expired, try to refresh the token
            await refreshAccessToken();
            config.headers['Authorization'] = `Bearer ${getToken()}`;
        } else {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Function to refresh the access token
const refreshAccessToken = async () => {
    try {
        const response = await API.post('/auth/refresh-token');
        const { access_token } = response.data;

        // Save the new token and its expiry time
        localStorage.setItem('accessToken', access_token);
        const tokenExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes from now
        localStorage.setItem('tokenExpiry', tokenExpiry);
    } catch (error) {
        console.error('Error refreshing access token', error);
        // Handle token refresh failure (e.g., redirect to login)
        localStorage.removeItem('accessToken');
        localStorage.removeItem('tokenExpiry');
        window.location.href = '/login'; // Redirect to login on failure
    }
};

export const userLogin = async (data) => API.post('/auth/login', data);

export const getCalls = async ({ offset = 0, limit = 10 }) => API.get(`/calls?offset=${offset}&limit=${limit}`);

export const refreshToken = async () => API.post(`/auth/refresh-token`);

export const toggleArchive = async (id) => API.put(`/calls/${id}/archive`);

export const addNote = async (id, content) => API.post(`/calls/${id}/note`, { content });