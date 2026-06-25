import { useState } from "react";
import { login } from "../../services/authService";
import { useNavigate } from "react-router-dom";

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

            navigate("/dashboard");

        } catch (err) {

            alert(err.response?.data?.message);

        }

    }

    return (
        <>
            {/* input */}
        </>
    );
}