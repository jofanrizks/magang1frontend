import { useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function RegisterForm() {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        nik: "",
        nama: "",
        instansi: "",
        jabatan: "",
        telp: "",
        password: "",
        password_confirmation: ""
    });

    async function handleSubmit(e) {

        e.preventDefault();

        try {

            await api.post(
                "/register",
                form
            );

            await Swal.fire({
                icon: "success",
                title: "Registrasi Berhasil",
                text: "Silakan lanjut verifikasi OTP"
            });
            localStorage.setItem(
                "nik",
                form.nik
            );

            navigate("/otp");

        } catch (err) {

            const errors =
                err.response?.data?.errors;

            let pesan = [];

            if (errors?.nik) {
                pesan.push("NIK sudah terdaftar");
            }

            if (errors?.telp) {
                pesan.push("Nomor HP sudah terdaftar");
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
                value={form.nik}
                onChange={(e) =>
                    setForm({
                        ...form,
                        nik: e.target.value
                    })
                }
            />

            <Input
                label="Nama"
                value={form.nama}
                onChange={(e) =>
                    setForm({
                        ...form,
                        nama: e.target.value
                    })
                }
            />

            <Input
                label="Instansi"
                value={form.instansi}
                onChange={(e) =>
                    setForm({
                        ...form,
                        instansi: e.target.value
                    })
                }
            />

            <Input
                label="Jabatan"
                value={form.jabatan}
                onChange={(e) =>
                    setForm({
                        ...form,
                        jabatan: e.target.value
                    })
                }
            />

            <Input
                label="No HP"
                value={form.telp}
                onChange={(e) =>
                    setForm({
                        ...form,
                        telp: e.target.value
                    })
                }
            />

            <Input
                label="Password"
                type="password"
                value={form.password}
                onChange={(e) =>
                    setForm({
                        ...form,
                        password: e.target.value
                    })
                }
            />

            <Input
                label="Konfirmasi Password"
                type="password"
                value={form.password_confirmation}
                onChange={(e) =>
                    setForm({
                        ...form,
                        password_confirmation: e.target.value
                    })
                }
            />

            <Button type="submit">
                Register
            </Button>

        </form>

    );

}