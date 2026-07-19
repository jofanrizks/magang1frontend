import axios from "axios";
import { API_BASE_URL } from "../config/api";

const api = axios.create({
    baseURL: API_BASE_URL
});

api.interceptors.request.use(config => {

    const token = localStorage.getItem("token");

    if (token) {

        config.headers.Authorization =
            `Bearer ${token}`;

    }

    return config;

});

api.interceptors.response.use(
    (response) => response,
    (error) => {
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
