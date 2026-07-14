import { useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

export default function OtpForm() {

    const navigate = useNavigate();

    const [nik, setNik] = useState(
        localStorage.getItem("nik") || ""
    );

    const [otp, setOtp] = useState("");

    async function handleSubmit(e) {

        e.preventDefault();

        try {
            await api.post(
                "/activate",
                { nik,
                    otp }
            );

            alert(
                "Verifikasi berhasil"
            );

            localStorage.removeItem("nik");

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
                label="NIK"
                value={nik}
                onChange={(e) =>
                    setNik(e.target.value)
                }
            />

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
