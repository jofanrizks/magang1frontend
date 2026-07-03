import { useState } from "react";
import { Link } from "react-router-dom";
import {
    ChevronDown,
    ChevronUp,
    ArrowRight
} from "lucide-react";

export default function ServiceAccordion({ menus }) {

    const [openMenu, setOpenMenu] = useState({});

    function toggleMenu(index) {

        setOpenMenu((prev) => ({
            ...prev,
            [index]: !prev[index]
        }));

    }

    return (

        <section
            id="layanan"
            className="
                max-w-7xl
                mx-auto
                px-6
                py-12
            "
        >

            {/* Heading */}

            <div className="text-left mb-16">

                <h2
                    className="
                        mt-2
                        text-4xl
                        font-bold
                        text-slate-900
                    "
                >

                    Seluruh Layanan Digital

                </h2>

                <p
                    className="
                        mt-4
                        text-slate-500
                        mx-auto
                        leading-8
                    "
                >

                    Pilih kategori layanan sesuai kebutuhan.
                    Seluruh layanan dapat diakses secara online
                    melalui satu portal yang terintegrasi.

                </p>

            </div>

            {/* Accordion */}

            <div
                className="
                    grid
                    grid-cols-1
                    lg:grid-cols-5
                    gap-6
                    items-start
                "
            >

                {menus.map((menu, index) => (

                    <div

                        key={index}

                        className="
                            bg-white
                            rounded-3xl
                            border
                            border-slate-200
                            overflow-hidden
                            shadow-sm
                            hover:shadow-xl
                            transition-all
                            duration-300
                        "

                    >

                        {/* Header */}

                        <button

                            onClick={() => toggleMenu(index)}

                            className="
                                w-full
                                px-6
                                py-5
                                flex
                                items-center
                                justify-between
                                font-semibold
                                text-slate-800
                                hover:bg-slate-50
                                transition
                                cursor-pointer
                            "

                        >

                            <span>

                                {menu.title}

                            </span>

                            {

                                openMenu[index]

                                    ? (
                                        <ChevronUp
                                            size={18}
                                            className="text-red-600"
                                        />
                                    )

                                    : (
                                        <ChevronDown
                                            size={18}
                                            className="text-red-500"
                                        />
                                    )

                            }

                        </button>

                        {/* Content */}

                        <div
                            className={`
                                transition-all
                                duration-300
                                overflow-hidden
                                ${
                                    openMenu[index]
                                        ? "max-h-96"
                                        : "max-h-0"
                                }
                            `}
                        >

                            <div className="border-t border-slate-100">

                                {

                                    menu.items.map((item) => (

                                        <Link

                                            key={item.id}

                                            to={item.path}

                                            className="
                                                flex
                                                items-center
                                                justify-between
                                                px-6
                                                py-4
                                                text-sm
                                                text-slate-600
                                                hover:bg-red-50
                                                hover:text-red-600
                                                transition
                                                group
                                            "

                                        >

                                            <span>

                                                {item.name}

                                            </span>

                                            <ArrowRight

                                                size={16}

                                                className="
                                                    opacity-0
                                                    -translate-x-2
                                                    transition
                                                    group-hover:opacity-100
                                                    group-hover:translate-x-0
                                                "

                                            />

                                        </Link>

                                    ))

                                }

                            </div>

                        </div>

                    </div>

                ))}

            </div>

        </section>

    );

}