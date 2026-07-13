import api from "../api/axios";

export async function login(data) {

    const response = await api.post(
        "/login",
        data
    );

    localStorage.setItem(
        "token",
        response.data.data.token
    );

    localStorage.setItem(
        "user",
        JSON.stringify(response.data.data.user)
    );

    return response.data;
}
