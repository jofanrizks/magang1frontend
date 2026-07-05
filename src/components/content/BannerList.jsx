import { useEffect, useState } from "react";
import {
    Image,
    Trash2,
    Images,
    Calendar,
} from "lucide-react";

import {
    getBanners,
    deleteBanner,
} from "../../services/bannerService";

import Swal from "sweetalert2";

export default function BannerList() {

    const [banners, setBanners] = useState([]);

    useEffect(() => {

        loadBanner();

    }, []);

    async function loadBanner() {

        const res = await getBanners();

        const sorted = res.data.data.sort((a, b) => {
            const numA = parseInt(a.title.replace("Banner ", ""));
            const numB = parseInt(b.title.replace("Banner ", ""));

            return numA - numB;
        });

        setBanners(sorted);

    }

    async function handleDelete(id) {

        const result = await Swal.fire({
            title: "Hapus Banner?",
            text: "Banner yang dihapus tidak dapat dikembalikan.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            cancelButtonText: "Batal",
            confirmButtonText: "Hapus",
        });

        if (!result.isConfirmed) return;

        await deleteBanner(id);

        loadBanner();

        Swal.fire({
            icon: "success",
            title: "Berhasil",
            text: "Banner berhasil dihapus.",
        });

    }

    return (

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

            {/* Header */}

            <div className="flex justify-between items-center mb-8">

                <div className="flex items-center gap-4">

                    <div
                        className="
                            w-14
                            h-14
                            rounded-2xl
                            bg-blue-100
                            text-blue-600
                            flex
                            items-center
                            justify-center
                        "
                    >

                        <Images size={28} />

                    </div>

                    <div>

                        <h2 className="text-2xl font-bold text-slate-800">

                            Banner Homepage

                        </h2>

                        <p className="text-slate-500 text-sm mt-1">

                            Banner yang tampil pada halaman utama website.

                        </p>

                    </div>

                </div>

                <div
                    className="
                        bg-gradient-to-r
                        from-blue-600
                        to-cyan-500
                        text-white
                        px-5
                        py-2
                        rounded-full
                        text-sm
                        font-semibold
                        shadow-lg
                    "
                >

                    {banners.length} / 5 Banner

                </div>

            </div>

            {/* Empty */}

            {banners.length === 0 ? (

                <div
                    className="
                        flex
                        flex-col
                        items-center
                        justify-center
                        py-24
                        border-2
                        border-dashed
                        border-slate-200
                        rounded-3xl
                        bg-slate-50
                    "
                >

                    <Image
                        size={64}
                        className="text-slate-300 mb-5"
                    />

                    <h3 className="text-2xl font-bold text-slate-700">

                        Belum Ada Banner

                    </h3>

                    <p className="text-slate-500 mt-2">

                        Upload banner pertama Anda.

                    </p>

                </div>

            ) : (

                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-7">

                    {banners.map((banner) => (

                        <div
                            key={banner.id}
                            className="
                                group
                                bg-white
                                rounded-3xl
                                overflow-hidden
                                border
                                border-slate-200
                                hover:border-blue-300
                                shadow-sm
                                hover:shadow-xl
                                transition-all
                                duration-300
                            "
                        >

                            {/* Image */}

                            <div className="relative overflow-hidden">

                                <img
                                    src={`http://localhost:8000/storage/${banner.image}`}
                                    alt={banner.title}
                                    className="
                                        w-full
                                        h-60
                                        object-cover
                                        group-hover:scale-105
                                        transition
                                        duration-500
                                    "
                                />

                                <div
                                    className="
                                        absolute
                                        inset-0
                                        bg-gradient-to-t
                                        from-black/40
                                        via-transparent
                                        to-transparent
                                    "
                                />

                            </div>

                            {/* Content */}

                            <div className="p-6">

                                <h3
                                    className="
                                        text-xl
                                        font-bold
                                        text-slate-800
                                        truncate
                                    "
                                >

                                    {banner.title || "Tanpa Judul"}

                                </h3>

                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                        text-slate-500
                                        text-sm
                                        mt-3
                                    "
                                >

                                    <Calendar size={15} />

                                    {banner.created_at
                                        ? new Date(
                                            banner.created_at
                                        ).toLocaleDateString("id-ID", {
                                            day: "2-digit",
                                            month: "long",
                                            year: "numeric",
                                        })
                                        : "Banner Homepage"}

                                </div>

                                <button
                                    onClick={() =>
                                        handleDelete(banner.id)
                                    }
                                    className="
                                        mt-6
                                        w-full
                                        flex
                                        items-center
                                        justify-center
                                        gap-2
                                        py-3
                                        rounded-2xl
                                        bg-red-500
                                        hover:bg-red-600
                                        text-white
                                        font-semibold
                                        transition
                                        cursor-pointer
                                    "
                                >

                                    <Trash2 size={18} />

                                    Hapus Banner

                                </button>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>

    );

}