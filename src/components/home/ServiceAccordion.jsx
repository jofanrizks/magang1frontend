import { useState } from "react";
import {
    Link,
    useNavigate
} from "react-router-dom";
import {
    ChevronDown,
    ChevronUp,
    ArrowRight,
    Lock
} from "lucide-react";

export default function ServiceAccordion({
    menus,
    currentUser,
    loadingUser = false
}) {
    const navigate = useNavigate();

    const [openMenu, setOpenMenu] = useState({});

    /*
    |--------------------------------------------------------------------------
    | Hak akses layanan
    |--------------------------------------------------------------------------
    |
    | Viewer:
    | - dapat membuka seluruh layanan
    | - tidak memiliki group_id
    | - hanya memiliki akses baca pada halaman Group Files
    |
    | User:
    | - hanya dapat membuka layanan sesuai group_id
    |
    */

    function canAccessService(serviceNumber) {
        if (!currentUser) {
            return false;
        }

        if (currentUser.role === "viewer") {
            return true;
        }

        if (currentUser.role === "user") {
            return (
                Number(serviceNumber) ===
                Number(currentUser.group_id)
            );
        }

        return false;
    }

    function toggleMenu(index) {
        const serviceNumber = index + 1;

        if (loadingUser) {
            return;
        }

        if (!currentUser) {
            navigate("/login", {
                replace: true
            });

            return;
        }

        if (!canAccessService(serviceNumber)) {
            return;
        }

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
                {menus.map((menu, index) => {
                    const serviceNumber = index + 1;

                    const isActiveService =
                        canAccessService(serviceNumber);

                    const isLocked =
                        !loadingUser &&
                        !isActiveService;

                    return (
                        <div
                            key={menu.title ?? index}
                            className={`
                                bg-white
                                rounded-3xl
                                border
                                border-slate-200
                                overflow-hidden
                                shadow-sm
                                transition-all
                                duration-300
                                ${
                                    isLocked
                                        ? "opacity-70"
                                        : "hover:shadow-xl"
                                }
                            `}
                        >
                            {/* Header */}

                            <button
                                type="button"
                                onClick={() =>
                                    toggleMenu(index)
                                }
                                disabled={loadingUser}
                                className={`
                                    w-full
                                    px-6
                                    py-5
                                    flex
                                    items-center
                                    justify-between
                                    font-semibold
                                    text-slate-800
                                    transition
                                    disabled:cursor-wait
                                    disabled:opacity-60
                                    ${
                                        isLocked
                                            ? "cursor-not-allowed"
                                            : "hover:bg-slate-50 cursor-pointer"
                                    }
                                `}
                            >
                                <span>
                                    {menu.title}
                                </span>

                                {loadingUser ? (
                                    <span
                                        className="
                                            h-4
                                            w-4
                                            rounded-full
                                            border-2
                                            border-slate-300
                                            border-t-blue-600
                                            animate-spin
                                        "
                                    />
                                ) : isLocked ? (
                                    <Lock
                                        size={18}
                                        className="text-slate-400"
                                    />
                                ) : openMenu[index] ? (
                                    <ChevronUp
                                        size={18}
                                        className="text-blue-600"
                                    />
                                ) : (
                                    <ChevronDown
                                        size={18}
                                        className="text-slate-500"
                                    />
                                )}
                            </button>

                            {/* Content */}

                            <div
                                className={`
                                    transition-all
                                    duration-300
                                    overflow-hidden
                                    ${
                                        openMenu[index] &&
                                        isActiveService
                                            ? "max-h-96"
                                            : "max-h-0"
                                    }
                                `}
                            >
                                <div className="border-t border-slate-100">
                                    {menu.items.map((item) => (
                                        <Link
                                            key={item.id}
                                            to={`/group-files?group_id=${serviceNumber}`}
                                            state={{
                                                groupId:
                                                    serviceNumber,
                                                groupName:
                                                    `group-${serviceNumber}`,
                                                serviceName:
                                                    menu.title
                                            }}
                                            className="
                                                flex
                                                items-center
                                                justify-between
                                                px-6
                                                py-4
                                                text-sm
                                                text-slate-600
                                                hover:bg-blue-50
                                                hover:text-blue-600
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
                                    ))}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}