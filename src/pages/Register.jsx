import RegisterForm from "../components/forms/RegisterForm";
import { Link } from "react-router-dom";

export default function Register() {

    return (

        <div className="
        min-h-screen
        bg-slate-100
        flex
        justify-center
        items-center">

            <div className="
            bg-white
            p-8
            rounded-3xl
            shadow-xl
            w-[500px]">

                <h1 className="
                text-3xl
                font-bold
                mb-6">

                    Register

                </h1>

                <RegisterForm/>

                <p className="mt-5">

                    Sudah punya akun?

                    <Link
                        className="text-blue-600 ml-2"
                        to="/"
                    >

                        Login

                    </Link>

                </p>

            </div>

        </div>

    );

}