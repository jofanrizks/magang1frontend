import api from "../api/axios";

export const getSetting = () => {
    return api.get("/setting");
};

export const updateSetting = (formData) => {
    return api.post("/setting", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};
