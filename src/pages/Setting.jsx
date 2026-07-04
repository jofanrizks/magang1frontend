import BannerForm from "../components/content/BannerForm";
import BannerList from "../components/content/BannerList";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function Setting() {

    const navigate = useNavigate();

    return (

        <div className="max-w-7xl mx-auto px-8 py-8">

            {/* Header */}

            <div className="flex items-center justify-between mb-10">

                <div className="flex items-center gap-4">

                    <button
                        onClick={() => navigate(-1)}
                        className="
                            w-11
                            h-11
                            rounded-xl
                            border
                            bg-white
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

                        <h1 className="text-4xl font-bold text-slate-800">

                            Content Management

                        </h1>

                        <p className="text-slate-500 mt-2">

                            Kelola banner homepage yang akan ditampilkan kepada pengguna.

                        </p>

                    </div>

                </div>

                <div
                    className="
                        bg-blue-50
                        text-blue-700
                        px-5
                        py-2
                        rounded-full
                        font-semibold
                    "
                >
                    Banner Setting
                </div>

            </div>

            <div className="grid xl:grid-cols-12 gap-8 items-start">

                <div className="xl:col-span-4">

                    <BannerForm />

                </div>

                <div className="xl:col-span-8">

                    <BannerList />

                </div>

            </div>

        </div>

    );

}