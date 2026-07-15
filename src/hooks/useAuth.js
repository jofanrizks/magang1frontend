import api from "../api/axios";

export async function login(data) {

    const response = await api.post(
        "/login",data
    );

    localStorage.setItem(
        "token",
        response.data.token
    );

    localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
    );

    return response.data;
}