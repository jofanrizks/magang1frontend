import api from "../api/axios";

export const sendDisableOtp = (password) => {
    return api.post("/account/disable/send-otp", {
        password,
    });
};

export const disableAccount = (otp) => {
    return api.post("/account/disable", {
        otp,
    });
};