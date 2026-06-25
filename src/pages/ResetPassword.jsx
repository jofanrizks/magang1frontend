import { useState } from "react";
import api from "../api/axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        otp: "",
        password: "",
        password_confirmation: ""
    });

    async function handleSubmit(e) {

        e.preventDefault();

        try {

            await api.post(
                "/forgot-password/reset",
                {
                    nik:
                        localStorage.getItem(
                            "reset_nik"
                        ),
                    ...form
                }
            );

            Swal.fire(
                "Berhasil",
                "Password berhasil diubah",
                "success"
            );

            navigate("/login");

        } catch (err) {

            Swal.fire(
                "Gagal",
                err.response?.data?.message ||
                "OTP salah",
                "error"
            );

        }

    }

    return (

        <div className="min-h-screen flex justify-center items-center bg-slate-100">

            <form
                onSubmit={handleSubmit}
                className="
                    bg-white
                    p-8
                    rounded-3xl
                    shadow-xl
                    w-[400px]
                    space-y-4
                "
            >

                <h1 className="text-2xl font-bold">
                    Reset Password
                </h1>

                <input
                    placeholder="OTP"
                    className="w-full border p-3 rounded-xl"
                    onChange={(e)=>
                        setForm({
                            ...form,
                            otp:e.target.value
                        })
                    }
                />

                <input
                    type="password"
                    placeholder="Password Baru"
                    className="w-full border p-3 rounded-xl"
                    onChange={(e)=>
                        setForm({
                            ...form,
                            password:e.target.value
                        })
                    }
                />

                <input
                    type="password"
                    placeholder="Konfirmasi Password"
                    className="w-full border p-3 rounded-xl"
                    onChange={(e)=>
                        setForm({
                            ...form,
                            password_confirmation:e.target.value
                        })
                    }
                />

                <button
                    className="
                        w-full
                        bg-green-600
                        text-white
                        py-3
                        rounded-xl
                    "
                >
                    Simpan Password
                </button>

            </form>

        </div>

    );

}