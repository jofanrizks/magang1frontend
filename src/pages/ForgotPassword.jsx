import { useState } from "react";
import api from "../api/axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {

    const navigate = useNavigate();

    const [nik, setNik] = useState("");

    async function sendOtp(e) {

        e.preventDefault();

        try {

            await api.post(
                "/forgot-password/send-otp",
                {
                    nik
                }
            );

            localStorage.setItem(
                "reset_nik",
                nik
            );

            Swal.fire(
                "Berhasil",
                "OTP berhasil dikirim",
                "success"
            );

            navigate(
                "/reset-password"
            );

        } catch (err) {

            Swal.fire(
                "Gagal",
                err.response?.data?.message ||
                "Gagal kirim OTP",
                "error"
            );

        }

    }

    return (

        <div className="min-h-screen flex justify-center items-center bg-slate-100">

            <form
                onSubmit={sendOtp}
                className="
                    bg-white
                    p-8
                    rounded-3xl
                    shadow-xl
                    w-[400px]
                "
            >

                <h1 className="text-2xl font-bold mb-6">
                    Lupa Password
                </h1>

                <input
                    type="text"
                    placeholder="Masukkan NIK"
                    value={nik}
                    onChange={(e)=>
                        setNik(
                            e.target.value
                        )
                    }
                    className="
                        w-full
                        border
                        p-3
                        rounded-xl
                    "
                />

                <button
                    className="
                        mt-4
                        w-full
                        bg-blue-600
                        text-white
                        py-3
                        rounded-xl
                    "
                >
                    Kirim OTP
                </button>

            </form>

        </div>

    );

}