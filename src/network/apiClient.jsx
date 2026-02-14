import axios, { InternalAxiosRequestConfig } from "axios";
// import dotenv from "dotenv"

// dotenv.config();
// export const BASE_URL = "http://192.168.29.218:2001/api/v1/user";
// export const IMAGE_URL = "http://192.168.29.218:2001/api/v1/user/"
// export const BASE_URL = "https://api.ilap.oceansoft.online/api/v1/user";
// export const IMAGE_URL = "https://api.ilap.oceansoft.online/api/v1/user/"
// export const BASE_URL = "https://api.ilap.me/api/v1/user";
// export const IMAGE_URL = "https://api.ilap.me/api/v1/user/"
export const BASE_URL = "https://alpha-tech-backend.onrender.com/api/mobile-api";
export const IMAGE_URL = "https://alpha-tech-backend.onrender.com/api/public/"
// export const BASE_URL = "http://192.168.1.22:4002/api/mobile-api";
// export const IMAGE_URL = "http://192.168.1.22:4002/api/public/"
// export const BASE_URL = process.env.REACT_APP_API_BASE_URL;
// export const IMAGE_URL = process.env.REACT_APP_IMAGE_URL;
export const NEXT_PUBLIC_TRANSLATE_KEY = 'AIzaSyD4rcn8bz9Nz8eqWlOJ-BjBMFau52NAtgE'

export const apiClient = axios.create({
  baseURL: BASE_URL,
});
apiClient.interceptors.request.use(
  function (config) {
    config.headers["Authorization"] = `Bearer ${localStorage.getItem("userToken")}`;
    config.headers["Content-Type"] = "application/json";

    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    } else {
      config.headers["Content-Type"] = "application/json";
    }
    return config;
  },
  function (error) {
    Promise.reject(error);
  }
);

export default apiClient;
