import api from "../api/axios";

export async function login(data) {

    const response = await api.post(
        "/login",
        data
    );

    localStorage.setItem(
        "token",
        response.data.token
    );

    return response.data;
}