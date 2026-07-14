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

export const uploadAdminGroupFile = (
    groupId,
    file
) => {
    const formData = new FormData();

    formData.append(
        "group_id",
        groupId
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
    groupId
) => {
    return api.patch(
        `/admin/group-files/${id}/move`,
        {
            group_id: groupId
        }
    );
};
