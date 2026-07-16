import { useEffect, useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Eye, UserRound } from "lucide-react";

export default function RegisterForm() {
    const navigate = useNavigate();

    const [groups, setGroups] = useState([]);
    const [loadingGroups, setLoadingGroups] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [form, setForm] = useState({
        role: "user",
        nik: "",
        nama: "",
        instansi: "",
        jabatan: "",
        telp: "",
        group_ids: [],
        password: "",
        password_confirmation: ""
    });

    useEffect(() => {
        fetchGroups();
    }, []);

    async function fetchGroups() {
        try {
            const response = await api.get("/groups");

            setGroups(response.data?.data || []);
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Gagal Mengambil Group",
                text:
                    err.response?.data?.message ||
                    "Daftar group tidak dapat dimuat"
            });
        } finally {
            setLoadingGroups(false);
        }
    }

    function handleChange(e) {
        const { name, value } = e.target;

        setForm((prevForm) => ({
            ...prevForm,
            [name]: value
        }));
    }

    function handleRoleChange(role) {
        setForm((prevForm) => ({
            ...prevForm,
            role,

            // Viewer tidak memiliki group.
            group_ids: role === "viewer"
                ? []
                : prevForm.group_ids
        }));
    }

    function handleGroupChange(groupId) {
        const numericGroupId = Number(groupId);

        setForm((prevForm) => ({
            ...prevForm,
            group_ids: prevForm.group_ids.includes(numericGroupId)
                ? prevForm.group_ids.filter(
                    (id) => id !== numericGroupId
                )
                : [
                    ...prevForm.group_ids,
                    numericGroupId
                ]
        }));
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (
            form.role === "user" &&
            form.group_ids.length === 0
        ) {
            await Swal.fire({
                icon: "warning",
                title: "Group Wajib Dipilih",
                text: "Pilih minimal satu group untuk akun User."
            });

            return;
        }

        setSubmitting(true);

        try {
            const payload = {
                ...form,

                // Viewer tidak perlu mengirim relasi group.
                group_ids:
                    form.role === "user"
                        ? form.group_ids
                        : []
            };

            await api.post("/register", payload);

            localStorage.setItem("nik", form.nik);

            await Swal.fire({
                icon: "success",
                title: "Registrasi Berhasil",
                text:
                    "Registrasi berhasil. Silakan menunggu persetujuan administrator."
            });

            navigate("/login");
        } catch (err) {
            const errors = err.response?.data?.errors;

            const pesan = [];

            if (errors?.role) {
                pesan.push(errors.role[0]);
            }

            if (errors?.nik) {
                pesan.push(errors.nik[0]);
            }

            if (errors?.nama) {
                pesan.push(errors.nama[0]);
            }

            if (errors?.instansi) {
                pesan.push(errors.instansi[0]);
            }

            if (errors?.jabatan) {
                pesan.push(errors.jabatan[0]);
            }

            if (errors?.telp) {
                pesan.push(errors.telp[0]);
            }

            if (errors?.group_ids) {
                pesan.push(errors.group_ids[0]);
            }

            if (errors?.password) {
                pesan.push(errors.password[0]);
            }

            if (errors?.password_confirmation) {
                pesan.push(errors.password_confirmation[0]);
            }

            Swal.fire({
                icon: "warning",
                title: "Registrasi Gagal",
                html:
                    pesan.length > 0
                        ? pesan.join("<br>")
                        : err.response?.data?.message ||
                          "Periksa kembali data yang diinput"
            });
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-4"
        >
            {/* Pilihan jenis akun */}
            <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                    Jenis Akun
                </label>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <button
                        type="button"
                        onClick={() => handleRoleChange("user")}
                        className={`
                            rounded-xl
                            border
                            p-4
                            text-left
                            transition
                            ${
                                form.role === "user"
                                    ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
                                    : "border-gray-300 bg-white hover:border-blue-300"
                            }
                        `}
                    >
                        <div className="flex items-start gap-3">
                            <div
                                className={`
                                    flex
                                    h-10
                                    w-10
                                    items-center
                                    justify-center
                                    rounded-lg
                                    ${
                                        form.role === "user"
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-100 text-gray-600"
                                    }
                                `}
                            >
                                <UserRound size={20} />
                            </div>

                            <div>
                                <p className="font-semibold text-gray-800">
                                    User
                                </p>

                                <p className="mt-1 text-xs leading-relaxed text-gray-500">
                                    Dapat menginput dan mengunggah data
                                    berdasarkan group yang dipilih.
                                </p>
                            </div>
                        </div>
                    </button>

                    <button
                        type="button"
                        onClick={() => handleRoleChange("viewer")}
                        className={`
                            rounded-xl
                            border
                            p-4
                            text-left
                            transition
                            ${
                                form.role === "viewer"
                                    ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
                                    : "border-gray-300 bg-white hover:border-blue-300"
                            }
                        `}
                    >
                        <div className="flex items-start gap-3">
                            <div
                                className={`
                                    flex
                                    h-10
                                    w-10
                                    items-center
                                    justify-center
                                    rounded-lg
                                    ${
                                        form.role === "viewer"
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-100 text-gray-600"
                                    }
                                `}
                            >
                                <Eye size={20} />
                            </div>

                            <div>
                                <p className="font-semibold text-gray-800">
                                    Viewer
                                </p>

                                <p className="mt-1 text-xs leading-relaxed text-gray-500">
                                    Hanya dapat melihat data dan tidak
                                    dapat mengubah atau mengunggah data.
                                </p>
                            </div>
                        </div>
                    </button>
                </div>
            </div>

            <Input
                label="NIK"
                name="nik"
                value={form.nik}
                onChange={handleChange}
            />

            <Input
                label="Nama"
                name="nama"
                value={form.nama}
                onChange={handleChange}
            />

            <Input
                label="Instansi"
                name="instansi"
                value={form.instansi}
                onChange={handleChange}
            />

            <Input
                label="Jabatan"
                name="jabatan"
                value={form.jabatan}
                onChange={handleChange}
            />

            <Input
                label="No HP"
                name="telp"
                value={form.telp}
                onChange={handleChange}
            />

            {/* Group hanya untuk role user */}
            {form.role === "user" && (
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        Group
                    </label>

                    <div className="rounded-lg border border-gray-300 p-3">
                        {loadingGroups ? (
                            <p className="text-sm text-gray-500">
                                Memuat group...
                            </p>
                        ) : groups.length === 0 ? (
                            <p className="text-sm text-gray-500">
                                Belum ada group yang tersedia.
                            </p>
                        ) : (
                            <div className="space-y-2">
                                {groups.map((group) => (
                                    <label
                                        key={group.id}
                                        className="
                                            flex
                                            cursor-pointer
                                            items-center
                                            gap-2
                                            rounded-lg
                                            p-2
                                            text-sm
                                            text-gray-700
                                            transition
                                            hover:bg-gray-50
                                        "
                                    >
                                        <input
                                            type="checkbox"
                                            checked={form.group_ids.includes(
                                                Number(group.id)
                                            )}
                                            onChange={() =>
                                                handleGroupChange(group.id)
                                            }
                                            className="
                                                h-4
                                                w-4
                                                rounded
                                                border-gray-300
                                                text-blue-600
                                                focus:ring-blue-500
                                            "
                                        />

                                        {group.name}
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    <p className="mt-1 text-xs text-gray-500">
                        Pilih minimal satu group. User dapat memilih
                        lebih dari satu group.
                    </p>
                </div>
            )}

            {form.role === "viewer" && (
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
                    <p className="text-sm text-blue-700">
                        Akun Viewer tidak perlu memilih group dan hanya
                        memiliki akses untuk melihat data.
                    </p>
                </div>
            )}

            <Input
                label="Password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
            />

            <Input
                label="Konfirmasi Password"
                name="password_confirmation"
                type="password"
                value={form.password_confirmation}
                onChange={handleChange}
            />

            <Button
                type="submit"
                disabled={
                    submitting ||
                    (
                        form.role === "user" &&
                        loadingGroups
                    )
                }
            >
                {submitting
                    ? "Memproses..."
                    : "Register"}
            </Button>
        </form>
    );
}
