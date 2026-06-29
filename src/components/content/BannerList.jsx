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

        if (!window.confirm("Hapus banner?")) {

            return;

        }

        await deleteBanner(id);

        loadBanner();

    }

    return (

        <div className="bg-white rounded-xl shadow p-6">

            <h2 className="text-xl font-semibold mb-6">

                Banner

            </h2>

            <div className="grid grid-cols-3 gap-6">

                {banners.map((banner) => (

                    <div
                        key={banner.id}
                        className="border rounded-xl overflow-hidden"
                    >

                        <img
                            src={`http://localhost:8000/storage/${banner.image}`}
                            className="w-full h-52 object-cover"
                        />

                        <div className="p-4">

                            <h3 className="font-semibold">

                                {banner.title}

                            </h3>

                            <button
                                onClick={() =>
                                    handleDelete(banner.id)
                                }
                                className="mt-4 w-full bg-red-600 text-white py-2 rounded-lg"
                            >

                                Delete

                            </button>

                        </div>

                    </div>

                ))}

            </div>

        </div>

    );

}