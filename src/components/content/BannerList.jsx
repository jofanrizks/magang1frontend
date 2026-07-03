import { useEffect, useState } from "react";
import {
    getBanners,
    deleteBanner,
} from "../../services/bannerService";

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

        if (!window.confirm("Hapus banner?")) return;

        await deleteBanner(id);

        loadBanner();

    }

    return (

        <div className="space-y-5">

            <div>

                <h2 className="text-xl font-bold">

                    Banner Homepage

                </h2>

                <p className="text-sm text-slate-500 mt-1">

                    Banner yang sedang ditampilkan pada halaman utama website.

                </p>

            </div>

            <div className="grid md:grid-cols-2 gap-6">

                {

                    banners.map((banner) => (

                        <div
                            key={banner.id}
                            className="
                                bg-white
                                rounded-2xl
                                border
                                shadow-sm
                                overflow-hidden
                                hover:shadow-md
                                transition
                            "
                        >

                            <img
                                src={`http://localhost:8000/storage/${banner.image}`}
                                className="
                                    w-full
                                    h-56
                                    object-cover
                                "
                            />

                            <div className="p-5">

                                <h3 className="font-semibold text-lg">

                                    {banner.title}

                                </h3>

                                <button
                                    onClick={() =>
                                        handleDelete(banner.id)
                                    }
                                    className="
                                        mt-5
                                        w-full
                                        bg-red-500
                                        hover:bg-red-600
                                        text-white
                                        py-3
                                        rounded-xl
                                        transition
                                        cursor-pointer
                                    "
                                >

                                    Delete Banner

                                </button>

                            </div>

                        </div>

                    ))

                }

            </div>

        </div>

    );

}