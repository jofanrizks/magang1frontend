import api from "../api/axios";

export const getPendingUsers = (params = {}) => {
    return api.get("/users/pending", { params });
};

export const getAllUsers = (params = {}) => {
    return api.get("/getallusers", { params });
};

export const getApprovedUsers = (params = {}) => {
    return api.get("/getApprovedUsers", { params });
};

export const getUserDetail = (id) => {
    return api.get(`/users/${id}`);
};

export const createUser = (payload) => {
    return api.post("/users", payload);
};

export const updateUser = (id, payload) => {
    return api.put(`/users/${id}`, payload);
};

export const resetPassword = (id, payload) => {
    return api.post(`/users/${id}/reset-password`, payload);
};

export const sendUserOtp = (id) => {
    return api.post(`/users/${id}/send-otp`);
};

export const approveUser = sendUserOtp;

export const rejectUser = (id, payload) => {
    return api.post(`/users/${id}/reject`, payload);
};

export const disableUser = (id) => {
    return api.post(`/users/${id}/disable`);
};

export const enableUser = (id) => {
    return api.post(`/users/${id}/enable`);
};

export const deleteUser = (id) => {
    return api.delete(`/users/${id}`);
};

export const getUserLogs = (id) => {
    return api.get(`/users/${id}/log`);
};

export const getUserLog = getUserLogs;

export const getGroups = () => {
    return api.get("/groups");
};

export const sendDisableOtp = async (password) => {

    const response = await api.post(
        "/account/disable/send-otp",
        {
            password
        }
    );

    return response.data;

};

export const disableAccount = async (otp) => {

    const response = await api.post(
        "/account/disable",
        {
            otp
        }
    );

    return response.data;

};