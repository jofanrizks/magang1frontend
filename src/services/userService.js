import api from "../api/axios";

export const getAllUsers = () => {
    return api.get("/getallusers");
};

export const approveUser = (id) => {
    return api.post(`/users/${id}/send-otp`);
};

export const rejectUser = (id) => {
    return api.post(`/users/${id}/reject`);
};
export const disableUser = (id) => {
    return api.post(`/users/${id}/disable`);
};

export const enableUser = (id) => {
    return api.post(`/users/${id}/enable`);
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
export const getUserLog = (id) => {
    return api.get(`/users/${id}/log`);
};