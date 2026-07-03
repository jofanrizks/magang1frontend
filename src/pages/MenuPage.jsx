import { useParams, useNavigate } from "react-router-dom";

export default function MenuPage() {

    const { id } = useParams();

    const navigate = useNavigate();

    return (

        <div className="min-h-screen bg-slate-100">

            <div className="max-w-5xl mx-auto p-8">

                <h1 className="text-3xl font-bold mb-6">
                    Menu {id}
                </h1>

                <div className="bg-white rounded-xl shadow p-6">

                    <p>
                        Ini adalah halaman Menu {id}
                    </p>

                </div>

                <button
                    onClick={() => navigate("/home")}
                    className="
                        mt-6
                        px-4
                        py-2
                        bg-blue-500
                        text-white
                        rounded-lg
                        hover:bg-blue-600
                        transition
                        duration-300
                        ease-in-out
                        cursor-pointer
                    "
                >
                    Kembali ke Home
                </button>

            </div>

        </div>

    );

}