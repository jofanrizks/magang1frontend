import api from "../api/axios";

export const sendReactivateOtp = (nik) => {
    return api.post(
        "/account/reactivate/send-otp",
        {
            nik
        }
    );
};

export const reactivateAccount = (data) => {
    return api.post(
        "/account/reactivate",
        data
    );
};