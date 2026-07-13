import {
    FaFacebookF,
    FaInstagram,
    FaYoutube,
    FaLinkedin
} from "react-icons/fa";

export default function Footer() {

    const year = new Date().getFullYear();

    return (

        <section
            id="kontak"
            className="
                mt-24
                bg-slate-900
                text-slate-300
            "
        >

            <div
                className="
                    max-w-7xl
                    mx-auto
                    px-6
                    py-16
                    grid
                    md:grid-cols-4
                    gap-10
                "
            >

                {/* Logo */}

                <div>

                    <div
                        className="
                            flex
                            items-center
                            gap-3
                            mb-5
                        "
                    >

                        <div
                            className="
                                w-12
                                h-12
                                rounded-xl
                                bg-gradient-to-r
                                from-blue-600
                                to-cyan-500
                                flex
                                items-center
                                justify-center
                                font-bold
                                text-white
                                text-lg
                            "
                        >

                            S

                        </div>

                        <div>

                            <h2
                                className="
                                    font-bold
                                    text-xl
                                    text-white
                                "
                            >
                                Sistem
                            </h2>

                            <p className="text-sm">

                                Portal Layanan

                            </p>

                        </div>

                    </div>

                    <p className="leading-7 text-slate-400">

                        Portal layanan digital yang
                        menyediakan akses berbagai
                        kebutuhan administrasi
                        secara cepat, aman,
                        dan terintegrasi.

                    </p>

                </div>

                {/* Navigasi */}

                <div>

                    <h3
                        className="
                            text-white
                            font-semibold
                            mb-5
                        "
                    >

                        Navigasi

                    </h3>

                    <ul className="space-y-3">

                        <li>

                            <a
                                href="#"
                                className="hover:text-white transition"
                            >

                                Home

                            </a>

                        </li>

                        <li>

                            <a
                                href="#"
                                className="hover:text-white transition"
                            >

                                Layanan

                            </a>

                        </li>

                        <li>

                            <a
                                href="#"
                                className="hover:text-white transition"
                            >

                                Tentang

                            </a>

                        </li>

                        <li>

                            <a
                                href="#"
                                className="hover:text-white transition"
                            >

                                Kontak

                            </a>

                        </li>

                    </ul>

                </div>

                {/* Sosial */}

                <div>

                    <h3
                        className="
                            text-white
                            font-semibold
                            mb-5
                        "
                    >

                        Ikuti Kami

                    </h3>

                    <div className="flex gap-4">

                        <button
                            className="
                                w-11
                                h-11
                                rounded-xl
                                bg-slate-800
                                hover:bg-blue-600
                                transition
                                flex
                                items-center
                                justify-center
                            "
                        >

                            <FaFacebookF size={18}/>

                        </button>

                        <button
                            className="
                                w-11
                                h-11
                                rounded-xl
                                bg-slate-800
                                hover:bg-pink-600
                                transition
                                flex
                                items-center
                                justify-center
                            "
                        >

                            <FaInstagram size={18}/>

                        </button>

                        <button
                            className="
                                w-11
                                h-11
                                rounded-xl
                                bg-slate-800
                                hover:bg-red-600
                                transition
                                flex
                                items-center
                                justify-center
                            "
                        >

                            <FaYoutube size={18}/>

                        </button>

                        <button
                            className="
                                w-11
                                h-11
                                rounded-xl
                                bg-slate-800
                                hover:bg-blue-400
                                transition
                                flex
                                items-center
                                justify-center
                            "
                        >

                            <FaLinkedin size={18}/>

                        </button>

                    </div>

                </div>

            </div>

            <div
                className="
                    border-t
                    border-slate-800
                    py-6
                "
            >

                <div
                    className="
                        max-w-7xl
                        mx-auto
                        px-6
                        flex
                        flex-col
                        md:flex-row
                        justify-between
                        gap-3
                        text-sm
                    "
                >

                    <span>

                        © {year} Sistem Informasi.
                        All rights reserved.

                    </span>

                    <span>

                        Built with React & Laravel

                    </span>

                </div>

            </div>

        </section>

    );

}