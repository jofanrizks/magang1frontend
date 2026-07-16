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
    const [errors, setErrors] = useState({});

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

        let normalizedValue = value;

        if (name === "nik" || name === "telp") {
            normalizedValue = value.replace(/\D/g, "");
        }

        setForm((prevForm) => ({
            ...prevForm,
            [name]: normalizedValue
        }));

        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: ""
        }));
    }

    function handleRoleChange(role) {
        setForm((prevForm) => ({
            ...prevForm,
            role,
            group_ids:
                role === "viewer"
                    ? []
                    : prevForm.group_ids
        }));

        setErrors((prevErrors) => ({
            ...prevErrors,
            role: "",
            group_ids: ""
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

        setErrors((prevErrors) => ({
            ...prevErrors,
            group_ids: ""
        }));
    }

    function validateForm() {
        const newErrors = {};

        if (!form.role) {
            newErrors.role = "Jenis akun wajib dipilih.";
        } else if (!["user", "viewer"].includes(form.role)) {
            newErrors.role = "Jenis akun tidak valid.";
        }

        if (!form.nik.trim()) {
            newErrors.nik = "NIK wajib diisi.";
        } else if (!/^\d{16}$/.test(form.nik)) {
            newErrors.nik =
                "NIK harus terdiri dari tepat 16 digit angka.";
        }

        if (!form.nama.trim()) {
            newErrors.nama = "Nama wajib diisi.";
        } else if (form.nama.trim().length < 3) {
            newErrors.nama = "Nama minimal 3 karakter.";
        } else if (
            !/^[A-Za-zÀ-ÿ.'\s-]+$/.test(form.nama.trim())
        ) {
            newErrors.nama =
                "Nama hanya boleh berisi huruf, spasi, titik, petik, dan tanda hubung.";
        }

        if (!form.instansi.trim()) {
            newErrors.instansi = "Instansi wajib diisi.";
        } else if (form.instansi.trim().length < 3) {
            newErrors.instansi =
                "Instansi minimal 3 karakter.";
        }

        if (!form.jabatan.trim()) {
            newErrors.jabatan = "Jabatan wajib diisi.";
        } else if (form.jabatan.trim().length < 2) {
            newErrors.jabatan =
                "Jabatan minimal 2 karakter.";
        }

        if (!form.telp.trim()) {
            newErrors.telp = "Nomor HP wajib diisi.";
        } else if (
            !/^(08\d{8,11}|62\d{8,13})$/.test(form.telp)
        ) {
            newErrors.telp =
                "Nomor HP harus diawali 08 atau 62 dan terdiri dari 10–15 digit.";
        }

        if (
            form.role === "user" &&
            form.group_ids.length === 0
        ) {
            newErrors.group_ids =
                "Pilih minimal satu group untuk akun User.";
        }

        if (!form.password) {
            newErrors.password = "Password wajib diisi.";
        } else if (form.password.length < 8) {
            newErrors.password =
                "Password minimal 8 karakter.";
        } else if (!/[A-Z]/.test(form.password)) {
            newErrors.password =
                "Password harus memiliki minimal satu huruf besar.";
        } else if (!/[a-z]/.test(form.password)) {
            newErrors.password =
                "Password harus memiliki minimal satu huruf kecil.";
        } else if (!/[0-9]/.test(form.password)) {
            newErrors.password =
                "Password harus memiliki minimal satu angka.";
        }

        if (!form.password_confirmation) {
            newErrors.password_confirmation =
                "Konfirmasi password wajib diisi.";
        } else if (
            form.password_confirmation !== form.password
        ) {
            newErrors.password_confirmation =
                "Konfirmasi password tidak sama dengan password.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (!validateForm()) {
            await Swal.fire({
                icon: "warning",
                title: "Data Belum Sesuai",
                text:
                    "Periksa kembali data registrasi yang ditandai."
            });

            return;
        }

        setSubmitting(true);

        try {
            const payload = {
                role: form.role,
                nik: form.nik.trim(),
                nama: form.nama.trim(),
                instansi: form.instansi.trim(),
                jabatan: form.jabatan.trim(),
                telp: form.telp.trim(),
                group_ids:
                    form.role === "user"
                        ? form.group_ids
                        : [],
                password: form.password,
                password_confirmation:
                    form.password_confirmation
            };

            await api.post("/register", payload);

            localStorage.setItem("nik", form.nik);

            await Swal.fire({
                icon: "success",
                title: "Registrasi Berhasil",
                text:
                    "Registrasi berhasil. Silakan menunggu persetujuan administrator."
            });

            navigate("/otp");
        } catch (err) {
            const backendErrors =
                err.response?.data?.errors;

            const pesan = [];

            if (backendErrors) {
                Object.values(backendErrors).forEach(
                    (messages) => {
                        if (Array.isArray(messages)) {
                            pesan.push(...messages);
                        }
                    }
                );
            }

            Swal.fire({
                icon: "warning",
                title: "Registrasi Gagal",
                html:
                    pesan.length > 0
                        ? pesan.join("<br>")
                        : err.response?.data?.message ||
                          "Periksa kembali data yang diinput."
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
            <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                    Jenis Akun
                </label>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <button
                        type="button"
                        onClick={() =>
                            handleRoleChange("user")
                        }
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
                        onClick={() =>
                            handleRoleChange("viewer")
                        }
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

                {errors.role && (
                    <p className="mt-2 text-sm text-red-600">
                        {errors.role}
                    </p>
                )}
            </div>

            <Input
                label="NIK"
                name="nik"
                value={form.nik}
                onChange={handleChange}
                inputMode="numeric"
                maxLength={16}
                placeholder="Masukkan 16 digit NIK"
                error={errors.nik}
            />

            <Input
                label="Nama"
                name="nama"
                value={form.nama}
                onChange={handleChange}
                placeholder="Masukkan nama lengkap"
                error={errors.nama}
            />

            <Input
                label="Instansi"
                name="instansi"
                value={form.instansi}
                onChange={handleChange}
                placeholder="Masukkan nama instansi"
                error={errors.instansi}
            />

            <Input
                label="Jabatan"
                name="jabatan"
                value={form.jabatan}
                onChange={handleChange}
                placeholder="Masukkan jabatan"
                error={errors.jabatan}
            />

            <Input
                label="No HP"
                name="telp"
                value={form.telp}
                onChange={handleChange}
                inputMode="numeric"
                maxLength={15}
                placeholder="Contoh: 081234567890"
                error={errors.telp}
            />

            {form.role === "user" && (
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        Group
                    </label>

                    <div
                        className={`
                            rounded-lg
                            border
                            p-3
                            ${
                                errors.group_ids
                                    ? "border-red-500"
                                    : "border-gray-300"
                            }
                        `}
                    >
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
                                                handleGroupChange(
                                                    group.id
                                                )
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
                        Pilih minimal satu group. User dapat
                        memilih lebih dari satu group.
                    </p>

                    {errors.group_ids && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.group_ids}
                        </p>
                    )}
                </div>
            )}

            {form.role === "viewer" && (
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
                    <p className="text-sm text-blue-700">
                        Akun Viewer tidak perlu memilih group dan
                        hanya memiliki akses untuk melihat data.
                    </p>
                </div>
            )}

            <div>
                <Input
                    label="Password"
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Masukkan password"
                    error={errors.password}
                />

                <p className="mt-1 text-xs text-gray-500">
                    Minimal 8 karakter, mengandung huruf besar,
                    huruf kecil, dan angka.
                </p>
            </div>

            <Input
                label="Konfirmasi Password"
                name="password_confirmation"
                type="password"
                value={form.password_confirmation}
                onChange={handleChange}
                placeholder="Masukkan ulang password"
                error={errors.password_confirmation}
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