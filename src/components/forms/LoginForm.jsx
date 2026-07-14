import { useState } from "react";
import { login } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Input from "../ui/Input";
import Button from "../ui/Button";

export default function LoginForm() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        nik: "",
        password: ""
    });

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            const res = await login(form);
            const payload = res.data.data;
            const user = payload.user;

            localStorage.setItem(
                "token",
                payload.token
            );

            localStorage.setItem(
                "user",
                JSON.stringify(user)
            );

            const mustChangePassword =
                user.must_change_password === true ||
                user.must_change_password === 1 ||
                user.must_change_password === "1";

            if (mustChangePassword) {
                await Swal.fire({
                    icon: "warning",
                    title: "Wajib Ganti Password",
                    text: "Password akun Anda masih berupa password sementara. Silakan ganti password terlebih dahulu.",
                    confirmButtonText: "Ganti Password",
                    allowOutsideClick: false,
                    allowEscapeKey: false
                });

                navigate("/forgot-password", {
                    replace: true,
                    state: {
                        nik: user.nik || form.nik,
                        source: "must-change-password"
                    }
                });

                return;
            }

            if (
                ["super_admin", "admin"].includes(user.role)
            ) {
                navigate("/dashboard", {
                    replace: true
                });
            } else {
                navigate("/home", {
                    replace: true
                });
            }
        } catch (err) {
            if (
                err.response?.data?.code ===
                "ACCOUNT_DISABLED"
            ) {
                localStorage.setItem(
                    "reactivate_nik",
                    form.nik
                );

                await Swal.fire({
                    icon: "warning",
                    title: "Akun Nonaktif",
                    text:
                        err.response?.data?.message ||
                        "Akun Anda nonaktif. Silakan aktifkan kembali akun.",
                    confirmButtonText: "Aktifkan Akun"
                });

                navigate("/reactivate-account", {
                    replace: true
                });

                return;
            }

            await Swal.fire({
                icon: "error",
                title: "Login Gagal",
                text:
                    err.response?.data?.message ||
                    "NIK atau password tidak valid."
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

            <Button type="submit">
                Login
            </Button>
        </form>
    );
}