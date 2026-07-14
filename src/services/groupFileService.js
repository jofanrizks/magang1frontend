import api from "../api/axios";

export const getGroupFiles = (
    page = 1,
    groupId = null
) => {
    const params = {
        page
    };

    if (groupId) {
        params.group_id = groupId;
    }

    return api.get("/group-files", {
        params
    });
};

export const uploadGroupFile = (formData) => {
    return api.post("/group-files", formData);
};

export const deleteGroupFile = (id) => {
    return api.delete(`/group-files/${id}`);
};