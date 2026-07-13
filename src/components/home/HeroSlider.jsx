import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getBanners } from "../../services/bannerService";
import { API_ORIGIN } from "../../config/api";

export default function HeroSlider({
    primaryColor = "#2563eb"
}) {
    const [banners, setBanners] = useState([]);
    const [current, setCurrent] = useState(0);

    async function fetchBanners() {
        try {
            const response = await getBanners();
            const bannerData = response.data?.data ?? [];

            setBanners(
                bannerData.map((banner) => ({
                    image: `${API_ORIGIN}/storage/${banner.image}`,
                    title: banner.title,
                    description: banner.description,
                }))
            );
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        fetchBanners();
    }, []);

    // Auto slider
    useEffect(() => {
        if (banners.length <= 1) return;

        const interval = setInterval(() => {
            setCurrent((prev) =>
                prev === banners.length - 1 ? 0 : prev + 1
            );
        }, 5000);

        return () => clearInterval(interval);
    }, [banners]);

    function nextSlide() {
        setCurrent((prev) =>
            prev === banners.length - 1 ? 0 : prev + 1
        );
    }

    function prevSlide() {
        setCurrent((prev) =>
            prev === 0 ? banners.length - 1 : prev - 1
        );
    }

    if (banners.length === 0) {
        return (
            <section className="relative h-screen flex items-center justify-center bg-gray-100">
                <p className="text-gray-500">Belum ada banner.</p>
            </section>
        );
    }

    return (
        <section className="relative h-screen overflow-hidden">
            {banners.map((banner, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-all duration-1000 ${
                        current === index
                            ? "opacity-100 scale-100"
                            : "opacity-0 scale-110"
                    }`}
                >
                    <img
                        src={banner.image}
                        alt={banner.title || "Banner"}
                        className="w-full h-full object-cover"
                    />

                    <div
                        className="absolute inset-0"
                        style={{
                            background: `linear-gradient(rgba(0,0,0,.55), rgba(0,0,0,.35)), ${primaryColor}55`,
                        }}
                    />

                    <div className="absolute inset-0 flex items-center">
                        <div className="max-w-7xl mx-auto px-6 text-white">
                            {/* {banner.title && (
                                <h1 className="text-5xl font-bold mb-4">
                                    {banner.title}
                                </h1>
                            )} */}

                            {/* {banner.description && (
                                <p className="text-lg max-w-2xl">
                                    {banner.description}
                                </p>
                            )} */}
                        </div>
                    </div>
                </div>
            ))}

            {banners.length > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        className="absolute left-8 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/20 backdrop-blur hover:bg-white/40 transition"
                    >
                        <ChevronLeft className="mx-auto text-white" />
                    </button>

                    <button
                        onClick={nextSlide}
                        className="absolute right-8 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/20 backdrop-blur hover:bg-white/40 transition"
                    >
                        <ChevronRight className="mx-auto text-white" />
                    </button>

                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3">
                        {banners.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrent(index)}
                                className={`h-3 rounded-full transition-all ${
                                    current === index
                                        ? "bg-white w-8"
                                        : "bg-white/50 w-3"
                                }`}
                            />
                        ))}
                    </div>
                </>
            )}
        </section>
    );
}
