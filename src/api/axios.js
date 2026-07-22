import axios from "axios";
import { API_BASE_URL } from "../config/api";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        Accept: "application/json"
    }
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        config.headers = config.headers ?? {};
        config.headers.Accept = "application/json";

        if (token) {
            config.headers.Authorization =
                `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            if (window.location.pathname !== "/login") {
                window.location.replace("/login");
            }
        }

        if (
            error.response?.status === 403 &&
            error.response?.data?.code === "ACCOUNT_DISABLED"
        ) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            if (window.location.pathname !== "/login") {
                window.location.replace("/login");
            }
        }

        return Promise.reject(error);
    }
);

export default api;