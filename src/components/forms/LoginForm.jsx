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

            localStorage.setItem(
                "token",
                payload.token
            );

            localStorage.setItem(
                "user",
                JSON.stringify(
                    payload.user
                )
            );
            if (
                ["super_admin", "admin"].includes(payload.user.role)
            ) {
                navigate("/dashboard");
            } else {
                navigate("/home");
            }
        } catch (err) {
            if (err.response?.data?.code === "ACCOUNT_DISABLED") {
                localStorage.setItem(
                    "reactivate_nik",
                    form.nik
                );

                await Swal.fire(
                    "Akun Nonaktif",
                    err.response?.data?.message ||
                    "Akun Anda nonaktif. Silakan aktifkan kembali akun.",
                    "warning"
                );

                navigate("/reactivate-account");
                return;
            }

            alert(
                err.response?.data?.message ||
                "Login gagal"
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
                value={form.nik}
                onChange={(e)=>
                    setForm({
                        ...form,
                        nik:e.target.value
                    })
                }
            />

            <Input
                label="Password"
                type="password"
                value={form.password}
                onChange={(e)=>
                    setForm({
                        ...form,
                        password:e.target.value
                    })
                }
            />

            <Button>
                Login
            </Button>

        </form>

    );

}
