import api from "../api/axios";

export const getBanners = () => {
    return api.get("/banner");
};

export const uploadBanner = (formData) => {
    return api.post("/banner", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

export const deleteBanner = (id) => {
    return api.delete(`/banner/${id}`);
};