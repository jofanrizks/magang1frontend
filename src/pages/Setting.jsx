import BannerForm from "../components/content/BannerForm";
import BannerList from "../components/content/BannerList";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    ImagePlus,
    Images
} from "lucide-react";

export default function Setting() {

    const navigate = useNavigate();

    return (

        <div className="min-h-screen bg-slate-50">

            <div className="max-w-7xl mx-auto px-8 py-10">

            {/* Header */}
            <div
                className="
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
                    <div className="flex items-center justify-between">

                        <div className="flex items-center gap-5">

                            <button
                                onClick={() => navigate(-1)}
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

                                <ArrowLeft size={22} />

                            </button>

                            <div>

                                <h1 className="text-4xl font-bold text-slate-800">

                                    Banner Settings

                                </h1>

                                <p className="text-slate-500 mt-2">

                                    Upload, ubah, dan kelola banner homepage
                                    yang akan ditampilkan kepada pengguna.

                                </p>

                            </div>

                        </div>

                    </div>

                </div>


                {/* Main Content */}

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