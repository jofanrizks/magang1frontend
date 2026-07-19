import api from "../api/axios";

export const getServices = () => {
    return api.get("/services");
};

export const getService = (id) => {
    return api.get(`/services/${id}`);
};

export const getAdminServices = () => {
    return api.get("/admin/services");
};

export const getAdminService = (id) => {
    return api.get(`/admin/services/${id}`);
};

export const updateAdminService = (
    id,
    payload
) => {
    return api.put(
        `/admin/services/${id}`,
        payload
    );
};
