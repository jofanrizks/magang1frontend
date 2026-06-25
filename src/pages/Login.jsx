import LoginForm from "../components/forms/LoginForm";
import { Link } from "react-router-dom";

export default function Login() {

    return (

        <div className="
        min-h-screen
        bg-slate-100
        flex
        items-center
        justify-center">

            <div className="
            bg-white
            shadow-xl
            rounded-3xl
            p-8
            w-[400px]">

                <h1 className="
                text-3xl
                font-bold
                mb-7">

                    Login

                </h1>

                <LoginForm/>

                <p className="mt-5">

                    Belum punya akun?

                    <Link
                        to="/register"
                        className="text-blue-600 ml-2"
                    >

                        Register

                    </Link>

                </p>

            </div>

        </div>

    );

}