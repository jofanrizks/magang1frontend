import { useEffect, useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function RegisterForm() {
    const navigate = useNavigate();

    const [groups, setGroups] = useState([]);
    const [loadingGroups, setLoadingGroups] = useState(true);

    const [form, setForm] = useState({
        nik: "",
        nama: "",
        instansi: "",
        jabatan: "",
        telp: "",
        group_id: "",
        password: "",
        password_confirmation: ""
    });

    useEffect(() => {
        fetchGroups();
    }, []);

    async function fetchGroups() {
        try {
            const response = await api.get("/groups");

            setGroups(
                response.data?.data || []
            );
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

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            await api.post("/register", {
                ...form,
                group_id: Number(form.group_id)
            });

            localStorage.setItem("nik", form.nik);

            await Swal.fire({
                icon: "success",
                title: "Registrasi Berhasil",
                text: "Silakan lanjut verifikasi OTP"
            });

            navigate("/otp");
        } catch (err) {
            const errors = err.response?.data?.errors;

            let pesan = [];

            if (errors?.nik) {
                pesan.push("NIK sudah terdaftar");
            }

            if (errors?.telp) {
                pesan.push("Nomor HP sudah terdaftar");
            }

            if (errors?.group_id) {
                pesan.push(errors.group_id[0]);
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
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-4"
        >
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

            <div>
                <label
                    htmlFor="group_id"
                    className="mb-2 block text-sm font-medium text-gray-700"
                >
                    Group
                </label>

                <select
                    id="group_id"
                    name="group_id"
                    value={form.group_id}
                    onChange={handleChange}
                    disabled={loadingGroups}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed disabled:bg-gray-100"
                >
                    <option value="">
                        {loadingGroups
                            ? "Memuat group..."
                            : "Pilih group"}
                    </option>

                    {groups.map((group) => (
                        <option
                            key={group.id}
                            value={group.id}
                        >
                            {group.name}
                        </option>
                    ))}
                </select>
            </div>

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
                disabled={loadingGroups}
            >
                Register
            </Button>
        </form>
    );
}