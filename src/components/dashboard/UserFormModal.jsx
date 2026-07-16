import { useEffect, useMemo, useState } from "react";

import Button from "../ui/Button";
import Input from "../ui/Input";
import Modal from "../ui/Modal";
import { getManageableRoles } from "../../utils/userPermissions";

const emptyForm = {
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

export default function UserFormModal({
    open,
    mode,
    user,
    currentUser,
    groups,
    loading,
    errors = {},
    onClose,
    onSubmit
}) {
    const manageableRoles = useMemo(
        () => getManageableRoles(currentUser),
        [currentUser]
    );

    const [form, setForm] = useState(emptyForm);
    const [localErrors, setLocalErrors] = useState({});

    const isEdit = mode === "edit";

    useEffect(() => {
        if (!open) return;

        if (isEdit && user) {
            setForm({
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
            });
        } else {
            setForm({
                ...emptyForm,
                role: manageableRoles.includes("user")
                    ? "user"
                    : manageableRoles[0] ?? "user"
            });
        }

        setLocalErrors({});
    }, [open, isEdit, user, manageableRoles]);

    function updateField(name, value) {
        setForm((previous) => ({
            ...previous,
            [name]: value,
            ...(name === "role" && value !== "user"
                ? { group_ids: [] }
                : {})
        }));
    }

    function handleGroupChange(groupId) {
        const numericGroupId = Number(groupId);

        setForm((previous) => ({
            ...previous,
            group_ids: previous.group_ids.includes(numericGroupId)
                ? previous.group_ids.filter((id) => id !== numericGroupId)
                : [...previous.group_ids, numericGroupId]
        }));
    }

    function firstError(name) {
        return localErrors[name] ||
            errors[name]?.[0] ||
            errors[name];
    }

    function handleSubmit(event) {
        event.preventDefault();

        const nextErrors = {};

        if (form.role === "user" && form.group_ids.length === 0) {
            nextErrors.group_ids = "Group wajib dipilih untuk role user.";
        }

        if (!isEdit && form.password !== form.password_confirmation) {
            nextErrors.password_confirmation = "Konfirmasi password tidak sama.";
        }

        if (Object.keys(nextErrors).length > 0) {
            setLocalErrors(nextErrors);
            return;
        }

        const payload = {
            role: form.role,
            nik: form.nik,
            nama: form.nama,
            instansi: form.instansi,
            jabatan: form.jabatan,
            telp: form.telp,
            group_ids: form.role === "user"
                ? form.group_ids
                : null
        };

        if (!isEdit) {
            payload.password = form.password;
            payload.password_confirmation = form.password_confirmation;
            payload.sts = form.sts;
            payload.approval = form.approval;
        }

        onSubmit(payload);
    }

    return (
        <Modal
            open={open}
            title={isEdit ? "Edit Pengguna" : "Tambah Pengguna"}
            description={isEdit ? "Perbarui data pengguna." : "Buat akun pengguna baru."}
            onClose={onClose}
            closeDisabled={loading}
            footer={
                <>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="rounded-lg bg-slate-100 px-5 py-2 font-semibold text-slate-700 transition hover:bg-slate-200 disabled:opacity-60"
                    >
                        Batal
                    </button>

                    <Button
                        type="submit"
                        form="user-form-modal"
                        disabled={loading}
                        className="w-auto rounded-lg px-5 py-2 disabled:opacity-60"
                    >
                        {loading ? "Menyimpan..." : "Simpan"}
                    </Button>
                </>
            }
        >
            <form
                id="user-form-modal"
                onSubmit={handleSubmit}
                className="grid grid-cols-1 gap-4 md:grid-cols-2"
            >
                <div className="space-y-2">
                    <label className="font-medium">Role</label>
                    <select
                        value={form.role}
                        onChange={(event) => updateField("role", event.target.value)}
                        disabled={loading}
                        className="w-full rounded-xl border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {manageableRoles.map((role) => (
                            <option key={role} value={role}>
                                {role}
                            </option>
                        ))}
                    </select>
                    {firstError("role") && <ErrorText>{firstError("role")}</ErrorText>}
                </div>

                <TextField
                    label="NIK"
                    value={form.nik}
                    onChange={(event) => updateField("nik", event.target.value)}
                    disabled={loading}
                    required
                    error={firstError("nik")}
                />

                <TextField
                    label="Nama"
                    value={form.nama}
                    onChange={(event) => updateField("nama", event.target.value)}
                    disabled={loading}
                    required
                    error={firstError("nama")}
                />

                <TextField
                    label="Instansi"
                    value={form.instansi}
                    onChange={(event) => updateField("instansi", event.target.value)}
                    disabled={loading}
                    required
                    error={firstError("instansi")}
                />

                <TextField
                    label="Jabatan"
                    value={form.jabatan}
                    onChange={(event) => updateField("jabatan", event.target.value)}
                    disabled={loading}
                    required
                    error={firstError("jabatan")}
                />

                <TextField
                    label="Nomor Telepon"
                    value={form.telp}
                    onChange={(event) => updateField("telp", event.target.value)}
                    disabled={loading}
                    required
                    error={firstError("telp")}
                />

                {form.role === "user" && (
                    <div className="space-y-2">
                        <label className="font-medium">Group</label>
                        <div className="max-h-44 overflow-y-auto rounded-xl border p-3">
                            {groups.map((group) => (
                                <label
                                    key={group.id}
                                    className="flex items-center gap-2 py-1 text-sm text-slate-700"
                                >
                                    <input
                                        type="checkbox"
                                        checked={form.group_ids.includes(Number(group.id))}
                                        onChange={() => handleGroupChange(group.id)}
                                        disabled={loading}
                                        className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    {group.name}
                                </label>
                            ))}
                        </div>
                        {firstError("group_ids") && <ErrorText>{firstError("group_ids")}</ErrorText>}
                    </div>
                )}

                {!isEdit && (
                    <>
                        <TextField
                            label="Password"
                            type="password"
                            value={form.password}
                            onChange={(event) => updateField("password", event.target.value)}
                            disabled={loading}
                            required
                            error={firstError("password")}
                        />

                        <TextField
                            label="Konfirmasi Password"
                            type="password"
                            value={form.password_confirmation}
                            onChange={(event) => updateField("password_confirmation", event.target.value)}
                            disabled={loading}
                            required
                            error={firstError("password_confirmation")}
                        />

                        <input type="hidden" name="sts" value={form.sts} />
                        <input type="hidden" name="approval" value={form.approval} />
                    </>
                )}
            </form>
        </Modal>
    );
}

function TextField({
    error,
    ...props
}) {
    return (
        <div className="space-y-2">
            <Input {...props} />
            {error && <ErrorText>{error}</ErrorText>}
        </div>
    );
}

function ErrorText({ children, className = "" }) {
    return (
        <p className={`text-sm text-red-600 ${className}`}>
            {children}
        </p>
    );
}
