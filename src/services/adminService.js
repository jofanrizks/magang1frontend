import api from "../api/axios";

export const getPendingUsers = () => {
    return api.get("/users/pending");
};

export const getAllUsers = () => {
    return api.get("/getallusers");
};

export const approveUser = (id) => {
    return api.post(`/users/${id}/send-otp`);
};

export const rejectUser = (id) => {
    return api.post(`/users/${id}/reject`);
};