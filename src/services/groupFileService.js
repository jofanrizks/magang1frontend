import api from "../api/axios";

export const getGroupFiles = (page = 1) => {
    return api.get("/group-files", {
        params: {
            page
        }
    });
};

export const uploadGroupFile = (formData) => {
    return api.post("/group-files", formData);
};

export const deleteGroupFile = (id) => {
    return api.delete(`/group-files/${id}`);
};
