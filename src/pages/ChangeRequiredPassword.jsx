import { useState } from "react";
import Swal from "sweetalert2";

import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import {
    changeRequiredPassword,
    me
} from "../services/authService";

export default function ChangeRequiredPassword() {
    const [form, setForm] = useState({
        current_password: "",
        password: "",
        password_confirmation: ""
    });

    const [loading, setLoading] = useState(false);

    function updateField(name, value) {
        setForm((previous) => ({
            ...previous,
            [name]: value
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();

        if (loading) {
            return;
        }

        if (
            !form.current_password ||
            !form.password ||
            !form.password_confirmation
        ) {
            await Swal.fire(
                "Gagal",
                "Semua kolom password wajib diisi.",
                "error"
            );

            return;
        }

        if (
            form.password !==
            form.password_confirmation
        ) {
            await Swal.fire(
                "Gagal",
                "Konfirmasi password baru tidak sama.",
                "error"
            );

            return;
        }

        if (
            form.current_password ===
            form.password
        ) {
            await Swal.fire(
                "Gagal",
                "Password baru tidak boleh sama dengan password lama.",
                "error"
            );

            return;
        }

        setLoading(true);

        try {
            await changeRequiredPassword(form);

            const response = await me();

            const user =
                response.data.data ??
                response.data.user ??
                response.data;

            if (!user?.role) {
                throw new Error(
                    "Data pengguna terbaru tidak ditemukan."
                );
            }

            localStorage.setItem(
                "user",
                JSON.stringify(user)
            );

            await Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: "Password berhasil diperbarui.",
                confirmButtonText: "Lanjutkan",
                allowOutsideClick: false
            });

            const destination = [
                "super_admin",
                "admin"
            ].includes(user.role)
                ? "/dashboard"
                : "/home";

            window.location.replace(destination);
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Password gagal diperbarui.";

            await Swal.fire(
                "Gagal",
                message,
                "error"
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md space-y-5 rounded-3xl bg-white p-8 shadow-xl"
            >
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">
                        Ganti Password
                    </h1>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                        Password sementara harus diganti sebelum masuk ke sistem.
                    </p>
                </div>

                <Input
                    label="Password Lama"
                    type="password"
                    value={form.current_password}
                    onChange={(event) =>
                        updateField(
                            "current_password",
                            event.target.value
                        )
                    }
                    disabled={loading}
                    autoComplete="current-password"
                    required
                />

                <Input
                    label="Password Baru"
                    type="password"
                    value={form.password}
                    onChange={(event) =>
                        updateField(
                            "password",
                            event.target.value
                        )
                    }
                    disabled={loading}
                    autoComplete="new-password"
                    required
                />

                <Input
                    label="Konfirmasi Password Baru"
                    type="password"
                    value={form.password_confirmation}
                    onChange={(event) =>
                        updateField(
                            "password_confirmation",
                            event.target.value
                        )
                    }
                    disabled={loading}
                    autoComplete="new-password"
                    required
                />

                <Button
                    type="submit"
                    disabled={loading}
                    className="disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {loading
                        ? "Menyimpan..."
                        : "Simpan Password"}
                </Button>
            </form>
        </div>
    );
}