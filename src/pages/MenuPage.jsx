import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function MenuPage() {

    const { id } = useParams();
    const navigate = useNavigate();

    return (

        <div className="min-h-screen bg-slate-50">

            <div className="max-w-5xl mx-auto px-8 py-8">

                {/* Header */}

                <div className="
                        sticky
                        top-0
                        flex
                        z-10
                        items-center
                        gap-4
                        mb-2
                        py-5
                        backdrop-blur-xs
                    "
                >

                    <button
                        onClick={() => navigate("/")}
                        className="
                            w-12
                            h-12
                            rounded-2xl
                            border
                            border-slate-200
                            bg-slate-50
                            hover:bg-slate-100
                            transition
                            flex
                            items-center
                            justify-center
                            cursor-pointer
                        "
                    >

                        <ArrowLeft size={20} />

                    </button>

                    <div>

                        <h1 className="text-3xl font-bold text-slate-800">

                            Menu {id}

                        </h1>

                        <p className="text-slate-500 mt-1">

                            Informasi dan konten untuk Menu {id}.

                        </p>

                    </div>

                </div>

                {/* Content */}

                <div
                    className="
                        bg-white
                        rounded-3xl
                        border
                        border-slate-200
                        shadow-sm
                        p-8
                    "
                >

                    <h2 className="text-xl font-semibold text-slate-800 mb-3">

                        Menu {id}

                    </h2>

                    <p className="text-slate-600 leading-relaxed">

                        Ini adalah halaman Menu {id}. Silakan tambahkan konten,
                        informasi, atau fitur sesuai kebutuhan.

                    </p>

                </div>

            </div>

        </div>

    );

}