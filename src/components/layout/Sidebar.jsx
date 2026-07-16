import { useState } from "react";
import {
    Link,
    useLocation,
    useNavigate
} from "react-router-dom";

import {
    PanelLeftClose,
    PanelLeftOpen,
    LayoutDashboard,
    Clock3,
    CheckCircle2,
    FolderCog,
    Settings,
    LogOut
} from "lucide-react";

export default function Sidebar() {
    const location = useLocation();
    const navigate = useNavigate();

    const [collapsed, setCollapsed] =
        useState(false);

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    const menus = [
        {
            name: "Dashboard",
            path: "/dashboard",
            icon: LayoutDashboard,
            roles: [
                "admin",
                "super_admin"
            ]
        },
        {
            name: "Pending User",
            path: "/pending-users",
            icon: Clock3,
            roles: [
                "admin",
                "super_admin"
            ]
        },
        {
            name: "Approved User",
            path: "/approved-users",
            icon: CheckCircle2,
            roles: [
                "admin",
                "super_admin"
            ]
        },
        {
            name: "Kelola Layanan",
            path: "/manage-services",
            icon: FolderCog,
            roles: [
                "admin",
                "super_admin"
            ]
        },
        {
            name: "Pengaturan Banner",
            path: "/banner-settings",
            icon: Settings,
            roles: [
                "admin",
                "super_admin"
            ]
        }
    ].filter((menu) =>
        menu.roles.includes(user?.role)
    );

    function logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login", {
            replace: true
        });
    }

    return (
        <aside
            className={`
                bg-slate-900
                border-r
                border-slate-800
                text-white
                min-h-screen
                flex
                flex-col
                transition-all
                duration-300
                ${
                    collapsed
                        ? "w-20"
                        : "w-72"
                }
            `}
        >
            <div className="border-b border-slate-800 p-4">
                <div className="flex items-center justify-between">
                    <div
                        className="
                            relative
                            group
                            w-11
                            h-11
                            shrink-0
                        "
                    >
                        <button
                            type="button"
                            onClick={() => {
                                if (collapsed) {
                                    setCollapsed(false);
                                }
                            }}
                            className="
                                absolute
                                inset-0
                                flex
                                cursor-pointer
                                items-center
                                justify-center
                                rounded-xl
                                bg-blue-600
                                font-bold
                                transition-all
                            "
                        >
                            {collapsed ? (
                                <>
                                    <span className="group-hover:hidden">
                                        S
                                    </span>

                                    <PanelLeftOpen
                                        size={18}
                                        className="hidden group-hover:block"
                                    />
                                </>
                            ) : (
                                <span>S</span>
                            )}
                        </button>

                        {collapsed && (
                            <div
                                className="
                                    invisible
                                    absolute
                                    left-16
                                    top-1/2
                                    z-50
                                    -translate-y-1/2
                                    whitespace-nowrap
                                    rounded-lg
                                    bg-slate-900/95
                                    px-3
                                    py-2
                                    text-sm
                                    font-medium
                                    opacity-0
                                    shadow-2xl
                                    backdrop-blur-md
                                    transition-all
                                    duration-200
                                    group-hover:visible
                                    group-hover:opacity-100
                                "
                            >
                                Buka Sidebar
                            </div>
                        )}
                    </div>

                    {!collapsed && (
                        <>
                            <div className="ml-3 flex-1">
                                <h2 className="font-semibold">
                                    Sistem
                                </h2>

                                <p className="text-xs text-slate-400">
                                    Admin Panel
                                </p>
                            </div>

                            <div className="relative group">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setCollapsed(true)
                                    }
                                    className="
                                        flex
                                        h-9
                                        w-9
                                        cursor-pointer
                                        items-center
                                        justify-center
                                        rounded-lg
                                        transition
                                        hover:bg-slate-800
                                    "
                                >
                                    <PanelLeftClose
                                        size={20}
                                    />
                                </button>

                                <div
                                    className="
                                        invisible
                                        absolute
                                        left-12
                                        top-1/2
                                        z-50
                                        -translate-y-1/2
                                        whitespace-nowrap
                                        rounded-lg
                                        bg-slate-900/95
                                        px-3
                                        py-2
                                        text-sm
                                        font-medium
                                        opacity-0
                                        shadow-2xl
                                        backdrop-blur-md
                                        transition-all
                                        duration-200
                                        group-hover:visible
                                        group-hover:opacity-100
                                    "
                                >
                                    Tutup Sidebar
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {!collapsed && (
                    <div
                        className="
                            mt-6
                            rounded-2xl
                            border
                            border-slate-800
                            bg-slate-800/60
                            p-4
                        "
                    >
                        <p className="font-medium">
                            {user?.nama ||
                                "Administrator"}
                        </p>

                        <p className="mt-1 text-sm capitalize text-slate-400">
                            {user?.role
                                ?.replace("_", " ") ||
                                "Admin"}
                        </p>
                    </div>
                )}
            </div>

            <div className="flex-1 space-y-1 px-3 py-4">
                {menus.map((menu) => {
                    const Icon = menu.icon;

                    const active =
                        location.pathname ===
                            menu.path ||
                        location.pathname.startsWith(
                            `${menu.path}/`
                        );

                    return (
                        <div
                            key={menu.path}
                            className="relative group"
                        >
                            <Link
                                to={menu.path}
                                className={`
                                    flex
                                    h-11
                                    items-center
                                    rounded-xl
                                    px-3
                                    transition-all
                                    duration-200
                                    ${
                                        collapsed
                                            ? "justify-center"
                                            : "gap-3"
                                    }
                                    ${
                                        active
                                            ? "bg-blue-600 text-white"
                                            : "text-slate-300 hover:bg-slate-800 hover:text-white"
                                    }
                                `}
                            >
                                <Icon size={20} />

                                {!collapsed && (
                                    <span className="text-sm font-medium">
                                        {menu.name}
                                    </span>
                                )}
                            </Link>

                            {collapsed && (
                                <div
                                    className="
                                        invisible
                                        absolute
                                        left-16
                                        top-1/2
                                        z-50
                                        -translate-y-1/2
                                        whitespace-nowrap
                                        rounded-lg
                                        bg-slate-900/95
                                        px-3
                                        py-2
                                        text-sm
                                        font-medium
                                        opacity-0
                                        shadow-2xl
                                        backdrop-blur-md
                                        transition-all
                                        duration-200
                                        group-hover:visible
                                        group-hover:opacity-100
                                    "
                                >
                                    {menu.name}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="border-t border-slate-800 p-3">
                <div className="relative group">
                    <button
                        type="button"
                        onClick={logout}
                        className="
                            flex
                            h-11
                            w-full
                            cursor-pointer
                            items-center
                            justify-center
                            gap-3
                            rounded-xl
                            bg-red-600
                            transition
                            hover:bg-red-700
                        "
                    >
                        <LogOut size={20} />

                        {!collapsed && (
                            <span>Logout</span>
                        )}
                    </button>

                    {collapsed && (
                        <div
                            className="
                                invisible
                                absolute
                                left-16
                                top-1/2
                                z-50
                                -translate-y-1/2
                                whitespace-nowrap
                                rounded-lg
                                border
                                border-slate-700
                                bg-slate-900/95
                                px-3
                                py-2
                                text-sm
                                font-medium
                                opacity-0
                                shadow-2xl
                                backdrop-blur-md
                                transition-all
                                duration-200
                                group-hover:visible
                                group-hover:opacity-100
                            "
                        >
                            Logout
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
}