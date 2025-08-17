import axios from "axios";

const apikey = process.env.NEXT_PUBLIC_REST_API_KEY;
const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:1337/api';

const axiosClient = axios.create({
  baseURL: apiUrl,
  headers: {
    ...(apikey && { Authorization: `Bearer ${apikey}` }),
  },
});

// Add request interceptor to log requests
axiosClient.interceptors.request.use(
  (config) => {
    console.log('Making request to:', config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.error('401 Unauthorized - Check your API key in .env.local file');
      console.error('Make sure NEXT_PUBLIC_REST_API_KEY is set correctly');
    }
    if (error.response?.status === 404) {
      console.error('404 Not Found - Check if the product ID exists and the API endpoint is correct');
      console.error('Requested URL:', error.config?.url);
    }
    return Promise.reject(error);
  }
);

export default axiosClient; 