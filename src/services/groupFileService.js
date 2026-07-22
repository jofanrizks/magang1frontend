import api from "../api/axios";

export const getGroupFiles = (
    page = 1,
    groupId = null,
    serviceOptionId = null
) => {
    const params = {
        page
    };

    if (groupId) {
        params.group_id = groupId;
    }

    if (serviceOptionId) {
        params.service_option_id = serviceOptionId;
    }

    return api.get("/group-files", {
        params
    });
};

export const uploadGroupFile = (formData) => {
    return api.post(
        "/group-files",
        formData
    );
};

export const deleteGroupFile = (id) => {
    return api.delete(
        `/group-files/${id}`
    );
};

export const replaceGroupFile = (
    id,
    formData
) => {
    return api.post(
        `/group-files/${id}/replace`,
        formData
    );
};

export const downloadGroupFile = (id) => {
    return api.get(
        `/group-files/${id}/download`,
        {
            responseType: "blob"
        }
    );
};

export const uploadAdminGroupFile = (
    groupId,
    serviceOptionId,
    file
) => {
    const formData = new FormData();

    formData.append(
        "group_id",
        groupId
    );

    formData.append(
        "service_option_id",
        serviceOptionId
    );

    formData.append(
        "file",
        file
    );

    return api.post(
        "/admin/group-files",
        formData
    );
};

export const deleteAdminGroupFile = (id) => {
    return api.delete(
        `/admin/group-files/${id}`
    );
};

export const moveAdminGroupFile = (
    id,
    groupId,
    serviceOptionId
) => {
    return api.patch(
        `/admin/group-files/${id}/move`,
        {
            group_id: groupId,
            service_option_id: serviceOptionId
        }
    );
};
