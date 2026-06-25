import { useState } from "react";
import { login } from "../../services/authService";
import { useNavigate } from "react-router-dom";
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

            localStorage.setItem(
                "token",
                res.data.token
            );

            localStorage.setItem(
                "user",
                JSON.stringify(
                    res.data.user
                )
            );
            if (
                res.data.user.role === "admin"
            ) {
                navigate("/dashboard");
            } else {
                navigate("/home");
            }
        } catch (err) {
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