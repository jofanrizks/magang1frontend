import { useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

export default function OtpForm() {

    const navigate = useNavigate();

    const [otp, setOtp] = useState("");

    async function handleSubmit(e) {

        e.preventDefault();

        try {
            const nik = localStorage.getItem("nik");
            await api.post(
                "/activate",
                { nik, otp }
            );

            alert(
                "Verifikasi berhasil"
            );

            navigate("/login");

        } catch (err) {

            alert(
                err.response?.data?.message ||
                "OTP tidak valid"
            );

        }

    }

    return (

        <form
            onSubmit={handleSubmit}
            className="space-y-4"
        >

            <Input
                label="Kode OTP"
                value={otp}
                maxLength={6}
                onChange={(e)=>
                    setOtp(e.target.value.replace(/\D/g, ""))
                }
            />

            <Button>
                Verifikasi OTP
            </Button>

        </form>

    );

}