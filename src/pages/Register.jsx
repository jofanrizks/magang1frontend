import RegisterForm from "../components/forms/RegisterForm";
import { Link } from "react-router-dom";

export default function Register() {

    return (

        <div
            className="
                min-h-screen
                bg-slate-100
                flex
                items-center
                justify-center
            "
        >

            <div
                className="
                    bg-white
                    w-full
                    max-w-lg
                    p-8
                    rounded-3xl
                    shadow-xl
                "
            >

                <h1
                    className="
                        text-3xl
                        font-bold
                        mb-6
                        text-center
                    "
                >
                    Register
                </h1>

                <RegisterForm />

                <p
                    className="
                        mt-5
                        text-center
                        text-sm
                        text-gray-600
                    "
                >
                    Sudah punya akun?

                    <Link
                        to="/login"
                        className="
                            ml-2
                            text-blue-600
                            hover:text-blue-800
                            font-medium
                        "
                    >
                        Login
                    </Link>

                </p>

            </div>

        </div>

    );

}