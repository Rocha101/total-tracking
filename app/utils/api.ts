import axios, { AxiosInstance } from "axios";
import Cookies from "js-cookie";

const api: AxiosInstance = axios.create({
  baseURL: `${process.env.API_URL}`,
});

api.interceptors.request.use(
  (config) => {
    const account = Cookies.get("account");
    const token = account ? JSON.parse(account).token : null;

    if (token) {
      config.headers.Authorization = `${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
