const emptyUserForm = {
    role: "user",
    nik: "",
    nama: "",
    instansi: "",
    jabatan: "",
    telp: "",
    group_ids: [],
    password: "",
    password_confirmation: "",
    sts: "aktif",
    approval: "approved"
};

export function createInitialUserForm(
    user,
    isEdit,
    manageableRoles
) {
    if (isEdit && user) {
        return {
            role: user.role ?? manageableRoles[0] ?? "user",
            nik: user.nik ?? "",
            nama: user.nama ?? "",
            instansi: user.instansi ?? "",
            jabatan: user.jabatan ?? "",
            telp: user.telp ?? "",
            group_ids: (user.groups ?? []).map((group) => Number(group.id)),
            password: "",
            password_confirmation: "",
            sts: user.sts ?? "aktif",
            approval: user.approval ?? "approved"
        };
    }

    return {
        ...emptyUserForm,
        role: manageableRoles.includes("user")
            ? "user"
            : manageableRoles[0] ?? "user"
    };
}
