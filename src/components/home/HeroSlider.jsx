import { useEffect, useState } from "react";
import {
    ChevronLeft,
    ChevronRight
} from "lucide-react";

export default function HeroSlider({

    banners,

    primaryColor

}) {

    const [current, setCurrent] = useState(0);

    useEffect(() => {

        if (banners.length <= 1) return;

        const interval = setInterval(() => {

            nextSlide();

        }, 5000);

        return () => clearInterval(interval);

    }, [current]);

    function nextSlide() {

        setCurrent((prev) =>
            prev === banners.length - 1
                ? 0
                : prev + 1
        );

    }

    function prevSlide() {

        setCurrent((prev) =>
            prev === 0
                ? banners.length - 1
                : prev - 1
        );

    }

    return (

        <section className="relative h-screen overflow-hidden">

            {

                banners.map((banner, index) => (

                    <div

                        key={index}

                        className={`
                            absolute
                            inset-0
                            transition-all
                            duration-1000
                            ${
                                current === index
                                    ? "opacity-100 scale-100"
                                    : "opacity-0 scale-110"
                            }
                        `}

                    >

                        <img

                            src={banner.image}

                            alt="Banner"

                            className="
                                w-full
                                h-full
                                object-cover
                            "

                        />

                        {/* Overlay */}

                        <div

                            className="absolute inset-0"

                            style={{

                                background: `
                                    linear-gradient(
                                        rgba(0,0,0,.55),
                                        rgba(0,0,0,.35)
                                    ),
                                    ${primaryColor}55
                                `

                            }}

                        />

                        {/* Content */}

                        <div

                            className="
                                absolute
                                inset-0
                                flex
                                items-center
                            "

                        >

                            <div

                                className="
                                    max-w-7xl
                                    mx-auto
                                    px-6
                                    text-white
                                "

                            >

                                <div

                                    className="
                                        mt-10
                                        flex
                                        gap-4
                                    "

                                >

                                </div>

                            </div>

                        </div>

                    </div>

                ))

            }

            {/* Arrow */}

            {

                banners.length > 1 && (

                    <>

                        <button

                            onClick={prevSlide}

                            className="
                                absolute
                                left-8
                                top-1/2
                                -translate-y-1/2
                                w-14
                                h-14
                                rounded-full
                                bg-white/20
                                backdrop-blur
                                hover:bg-white/40
                                transition
                            "

                        >

                            <ChevronLeft className="mx-auto text-white"/>

                        </button>

                        <button

                            onClick={nextSlide}

                            className="
                                absolute
                                right-8
                                top-1/2
                                -translate-y-1/2
                                w-14
                                h-14
                                rounded-full
                                bg-white/20
                                backdrop-blur
                                hover:bg-white/40
                                transition
                            "

                        >

                            <ChevronRight className="mx-auto text-white"/>

                        </button>

                    </>

                )

            }

            {/* Indicator */}

            {

                banners.length > 1 && (

                    <div

                        className="
                            absolute
                            bottom-10
                            left-1/2
                            -translate-x-1/2
                            flex
                            gap-3
                        "

                    >

                        {

                            banners.map((_, index) => (

                                <button

                                    key={index}

                                    onClick={() => setCurrent(index)}

                                    className={`
                                        w-3
                                        h-3
                                        rounded-full
                                        transition-all
                                        ${
                                            current === index
                                                ? "bg-white w-8"
                                                : "bg-white/50"
                                        }
                                    `}

                                />

                            ))

                        }

                    </div>

                )

            }

        </section>

    );

}