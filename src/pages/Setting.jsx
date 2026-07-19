import BannerForm from "../components/content/BannerForm";
import BannerList from "../components/content/BannerList";
import {
    Images
} from "lucide-react";

export default function Setting() {

    return (

        <div className="min-h-screen bg-slate-50">

            <div className="max-w-7xl mx-auto px-8 py-10">

                {/* Header */}

                <div
                    className="
                        bg-white
                        rounded-3xl
                        border
                        border-slate-200
                        shadow-sm
                        p-8
                        mb-8
                    "
                >

                    <div className="flex items-center justify-between">

                        <div className="flex items-center gap-5">

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

                        <div
                            className="
                                flex
                                items-center
                                gap-3
                                bg-blue-50
                                text-blue-700
                                px-5
                                py-3
                                rounded-2xl
                                font-semibold
                            "
                        >

                            <Images size={20} />

                            Homepage Banner

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
