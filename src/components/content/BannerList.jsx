import { useEffect, useState } from "react";
import {
    Image,
    Trash2
} from "lucide-react";

import {
    getBanners,
    deleteBanner
} from "../../services/bannerService";

import Swal from "sweetalert2";

export default function BannerList() {

    const [banners, setBanners] = useState([]);

    useEffect(() => {

        loadBanner();

    }, []);

    async function loadBanner() {

        const res = await getBanners();

        setBanners(res.data.data);

    }

    async function handleDelete(id) {

        const result = await Swal.fire({

            title: "Hapus Banner?",

            text: "Banner yang dihapus tidak dapat dikembalikan.",

            icon: "warning",

            showCancelButton: true,

            confirmButtonColor: "#ef4444",

            cancelButtonText: "Batal",

            confirmButtonText: "Hapus"

        });

        if (!result.isConfirmed) return;

        await deleteBanner(id);

        loadBanner();

        Swal.fire({

            icon: "success",

            title: "Berhasil",

            text: "Banner berhasil dihapus."

        });

    }

    return (

        <div
            className="
                bg-white
                rounded-3xl
                shadow-xl
                border
                border-slate-200
                p-8
            "
        >

            {/* Header */}

            <div className="flex justify-between items-center mb-8">

                <div>

                    <h2 className="text-2xl font-bold">

                        Banner Homepage

                    </h2>

                    <p className="text-slate-500 mt-2">

                        Banner yang sedang digunakan pada halaman Home.

                    </p>

                </div>

                <div
                    className="
                        px-4
                        py-2
                        rounded-xl
                        bg-blue-100
                        text-blue-700
                        font-semibold
                    "
                >

                    {banners.length} / 5 Banner

                </div>

            </div>

            {

                banners.length === 0 ? (

                    <div
                        className="
                            flex
                            flex-col
                            items-center
                            justify-center
                            py-24
                            text-slate-400
                        "
                    >

                        <Image
                            size={70}
                            strokeWidth={1.5}
                        />

                        <h3 className="mt-5 text-xl font-semibold">

                            Belum Ada Banner

                        </h3>

                        <p className="mt-2">

                            Upload banner pertama Anda.

                        </p>

                    </div>

                ) : (

                    <div
                        className="
                            grid
                            md:grid-cols-2
                            xl:grid-cols-3
                            gap-6
                        "
                    >

                        {

                            banners.map((banner) => (

                                <div
                                    key={banner.id}
                                    className="
                                        group
                                        rounded-2xl
                                        overflow-hidden
                                        border
                                        border-slate-200
                                        shadow-md
                                        hover:shadow-xl
                                        transition
                                        bg-white
                                    "
                                >

                                    <div className="relative">

                                        <img
                                            src={`http://localhost:8000/storage/${banner.image}`}
                                            alt={banner.title}
                                            className="
                                                h-56
                                                w-full
                                                object-cover
                                                group-hover:scale-105
                                                transition
                                                duration-300
                                            "
                                        />

                                        <div
                                            className="
                                                absolute
                                                inset-0
                                                bg-black/0
                                                group-hover:bg-black/10
                                                transition
                                            "
                                        />

                                    </div>

                                    <div className="p-5">

                                        <h3
                                            className="
                                                font-bold
                                                text-lg
                                                text-slate-800
                                                line-clamp-1
                                            "
                                        >

                                            {banner.title}

                                        </h3>

                                        <p className="text-slate-500 text-sm mt-2">

                                            Banner Homepage

                                        </p>

                                        <button
                                            onClick={() =>
                                                handleDelete(banner.id)
                                            }
                                            className="
                                                mt-5
                                                w-full
                                                flex
                                                items-center
                                                justify-center
                                                gap-2
                                                py-3
                                                rounded-xl
                                                bg-red-500
                                                hover:bg-red-600
                                                text-white
                                                transition
                                                cursor-pointer
                                            "
                                        >

                                            <Trash2 size={18} />

                                            Hapus Banner

                                        </button>

                                    </div>

                                </div>

                            ))

                        }

                    </div>

                )

            }

        </div>

    );

}