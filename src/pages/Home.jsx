import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Home() {

    const [setting, setSetting] = useState(null);

    useEffect(() => {
        getSetting();
    }, []);

    async function getSetting() {

        try {

            const res = await api.get(
                "/settings"
            );

            setSetting(
                res.data
            );

        } catch (err) {

            console.log(err);

        }
    }

    if (!setting) {

        return (

            <div
                className="
                    min-h-screen
                    flex
                    items-center
                    justify-center
                "
            >
                Loading...
            </div>

        );

    }

    return (

        <div
            className="
                min-h-screen
                bg-slate-100
            "
        >

            {/* Navbar */}

            <nav
                className="
                    bg-white
                    shadow
                    px-6
                    py-4
                    flex
                    items-center
                    justify-between
                "
            >

                <div
                    className="
                        flex
                        items-center
                        gap-3
                    "
                >

                    {setting.logo && (

                        <img
                            src={`http://127.0.0.1:8000/storage/${setting.logo}`}
                            alt="Logo"
                            className="
                                w-10
                                h-10
                                object-contain
                            "
                        />

                    )}

                    <h1
                        className="
                            text-xl
                            font-bold
                        "
                    >
                        {setting.app_name}
                    </h1>

                </div>

            </nav>

            {/* Hero Banner */}

            <section
                className="
                    max-w-7xl
                    mx-auto
                    px-6
                    py-8
                "
            >

                <div
                    className="
                        relative
                        rounded-3xl
                        overflow-hidden
                        shadow-xl
                    "
                >

                    {setting.banner && (

                        <img
                            src={`http://127.0.0.1:8000/storage/${setting.banner}`}
                            alt="Banner"
                            className="
                                w-full
                                h-[450px]
                                object-cover
                            "
                        />

                    )}

                    <div
                        className="
                            absolute
                            inset-0
                            bg-black/50
                            flex
                            flex-col
                            items-center
                            justify-center
                            text-center
                            text-white
                            px-6
                        "
                    >

                        <h1
                            className="
                                text-5xl
                                font-bold
                                mb-4
                            "
                        >
                            {setting.hero_title ||
                                "Selamat Datang"}
                        </h1>

                        <p
                            className="
                                text-lg
                                max-w-2xl
                            "
                        >
                            {setting.hero_subtitle ||
                                "Sistem Pelayanan Digital"}
                        </p>

                    </div>

                </div>

            </section>

            {/* Dropdown Layanan */}

            <section
                className="
                    max-w-7xl
                    mx-auto
                    px-6
                    pb-8
                "
            >

                <div
                    className="
                        bg-white
                        rounded-2xl
                        shadow
                        p-6
                    "
                >

                    <h2
                        className="
                            text-xl
                            font-semibold
                            mb-4
                        "
                    >
                        Pilih Layanan
                    </h2>

                    <select
                        className="
                            w-full
                            border
                            rounded-xl
                            p-3
                        "
                    >

                        <option>
                            Pilih Layanan
                        </option>

                        <option>
                            Pengajuan Surat
                        </option>

                        <option>
                            Pengaduan
                        </option>

                        <option>
                            Konsultasi
                        </option>

                    </select>

                </div>

            </section>

            {/* Informasi */}

            <section
                className="
                    max-w-7xl
                    mx-auto
                    px-6
                    pb-10
                    grid
                    md:grid-cols-3
                    gap-6
                "
            >

                <div
                    className="
                        bg-white
                        p-6
                        rounded-2xl
                        shadow
                    "
                >

                    <h3
                        className="
                            text-lg
                            font-semibold
                            mb-2
                        "
                    >
                        Informasi
                    </h3>

                    <p
                        className="
                            text-gray-600
                        "
                    >
                        Informasi terbaru
                        mengenai pelayanan.
                    </p>

                </div>

                <div
                    className="
                        bg-white
                        p-6
                        rounded-2xl
                        shadow
                    "
                >

                    <h3
                        className="
                            text-lg
                            font-semibold
                            mb-2
                        "
                    >
                        Jadwal
                    </h3>

                    <p
                        className="
                            text-gray-600
                        "
                    >
                        Jam operasional
                        pelayanan.
                    </p>

                </div>

                <div
                    className="
                        bg-white
                        p-6
                        rounded-2xl
                        shadow
                    "
                >

                    <h3
                        className="
                            text-lg
                            font-semibold
                            mb-2
                        "
                    >
                        Kontak
                    </h3>

                    <p
                        className="
                            text-gray-600
                        "
                    >
                        Hubungi admin jika
                        membutuhkan bantuan.
                    </p>

                </div>

            </section>

        </div>

    );

}