import BannerForm from "../components/content/BannerForm";
import BannerList from "../components/content/BannerList";
import { useNavigate } from "react-router-dom";
import { ImagePlus } from "lucide-react";
import { ArrowLeft } from "lucide-react";

export default function Setting() {

    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50">

            <div className="max-w-7xl mx-auto px-8 py-10">

                <button
                    onClick={() => navigate("/")}
                    className="
                        flex
                        items-center
                        gap-2
                        px-4
                        py-3
                        rounded-2xl
                        bg-white
                        border
                        border-slate-200
                        shadow-sm
                        hover:shadow-md
                        hover:bg-slate-100
                        transition
                        cursor-pointer
                    "
                >
                    <ArrowLeft />
                    
                    <span className="font-semibold">
                        Kembali
                    </span>

                </button>

                {/* Header */}

                <div className="mb-10">

                    <div className="flex items-center gap-3">

                        <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg">

                            <ImagePlus className="text-white" />

                        </div>

                        <div>

                            <h1 className="text-4xl font-bold text-slate-800">

                                Banner Settings

                            </h1>

                            <p className="text-slate-500 mt-1">

                                Kelola banner homepage website dengan mudah.

                            </p>

                        </div>

                    </div>

                </div>

                {/* Content */}

                <div className="grid lg:grid-cols-12 gap-8">

                    <div className="lg:col-span-4">

                        <BannerForm />

                    </div>

                    <div className="lg:col-span-8">

                        <BannerList />

                    </div>

                </div>

            </div>

        </div>
    );
}