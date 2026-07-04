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

        const sorted = res.data.data.sort((a, b) =>
            a.title.localeCompare(b.title)
        );

        setBanners(sorted);

    }

    async function handleDelete(id) {

        if (!window.confirm("Hapus banner?")) return;

        await deleteBanner(id);

        loadBanner();

    }

    return (

        <div className="bg-white rounded-3xl border shadow-sm p-8">

            <div className="flex justify-between items-center mb-8">

                <div>

                    <h2 className="text-2xl font-bold">

                        Banner Homepage

                    </h2>

                    <p className="text-sm text-slate-500 mt-1">

                        Banner yang tampil pada halaman utama website.

                    </p>

                </div>

                <div
                    className="
                        bg-blue-50
                        text-blue-700
                        px-4
                        py-2
                        rounded-full
                        font-semibold
                    "
                >

                    {banners.length} / 5 Banner

                </div>

            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

                {

                    banners.map((banner) => (

                        <div
                            key={banner.id}
                            className="
                                rounded-2xl
                                overflow-hidden
                                border
                                bg-slate-50
                                hover:shadow-lg
                                transition
                            "
                        >

                            <img
                                src={`http://localhost:8000/storage/${banner.image}`}
                                className="
                                    w-full
                                    h-52
                                    object-cover
                                "
                            />

                            <div className="p-5">

                                <h3 className="font-bold text-lg">

                                    {banner.title}

                                </h3>

                                <button
                                    onClick={() =>
                                        handleDelete(banner.id)
                                    }
                                    className="
                                        mt-5
                                        w-full
                                        py-3
                                        rounded-xl
                                        bg-red-500
                                        hover:bg-red-600
                                        text-white
                                        font-medium
                                        transition
                                        cursor-pointer
                                    "
                                >

                                    Hapus Banner

                                </button>

                            </div>

                        </div>

                    ))

                }

            </div>

        </div>

    );

}