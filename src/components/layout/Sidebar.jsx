import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import {
    PanelLeftClose,
    PanelLeftOpen,
    LayoutDashboard,
    Clock3,
    CheckCircle2,
    User,
    LogOut
} from "lucide-react";

export default function Sidebar() {

    const location = useLocation();
    const navigate = useNavigate();

    const [collapsed, setCollapsed] = useState(false);

    const user = JSON.parse(localStorage.getItem("user"));

    const menus = [
        {
            name: "Dashboard",
            path: "/dashboard",
            icon: LayoutDashboard
        },
        {
            name: "Pending User",
            path: "/pending-users",
            icon: Clock3
        },
        {
            name: "Approved User",
            path: "/approved-users",
            icon: CheckCircle2
        },
    
    ];

    function logout() {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");

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
                ${collapsed ? "w-20" : "w-72"}
            `}
        >

            {/* ================= HEADER ================= */}

            <div className="border-b border-slate-800 p-4">

                <div className="flex items-center justify-between">

                    {/* Logo */}

                    <div
                        className="
                            relative
                            group
                            w-11
                            h-11
                            shrink-0
                        "
                    >

                        {/* Logo */}

                        <button
                            onClick={() => collapsed && setCollapsed(false)}
                            className="
                                absolute
                                inset-0
                                flex
                                items-center
                                justify-center
                                rounded-xl
                                font-bold
                                transition-all
                                hover:bg-slate-800
                            "
                        >


                            {/* Saat collapse */}
                            {collapsed ? (

                                <>
                                    <span className="group-hover:hidden cursor-pointer">
                                        S
                                    </span>

                                    <PanelLeftOpen
                                        size={18}
                                        className="hidden group-hover:block cursor-pointer"
                                    />
                                </>


                            ) : (

                                <span>S</span>

                            )}

                        </button>

                        {collapsed && (

                            <div
                                    className="
                                        absolute
                                        left-16
                                        top-1/2
                                        -translate-y-1/2
                                        whitespace-nowrap
                                        rounded-lg
                                        bg-slate-900/95
                                        backdrop-blur-md
                                        px-3
                                        py-2
                                        text-sm
                                        font-medium
                                        shadow-2xl
                                        opacity-0
                                        invisible
                                        group-hover:opacity-100
                                        group-hover:visible
                                        transition-all
                                        duration-200
                                        z-50
                                    "
                                >

                                    Buka Sidebar

                                </div>
                        )}

                    </div>

                    {/* Judul */}

                    {!collapsed && (

                        <>

                            <div className="flex-1 ml-3">

                                <h2 className="font-semibold">
                                    Sistem
                                </h2>

                                <p className="text-xs text-slate-400">
                                    Admin Panel
                                </p>

                            </div>

                            <div className="relative group">

                                <button
                                    onClick={() => setCollapsed(true)}
                                    className="
                                        w-9
                                        h-9
                                        rounded-lg
                                        flex
                                        items-center
                                        justify-center
                                        hover:bg-slate-800
                                        transition
                                        cursor-pointer
                                    "
                                >

                                    <PanelLeftClose size={20} />

                                </button>

                                <div
                                    className="
                                        absolute
                                        left-16
                                        top-1/2
                                        -translate-y-1/2
                                        whitespace-nowrap
                                        rounded-lg
                                        bg-slate-900/95
                                        backdrop-blur-md
                                        px-3
                                        py-2
                                        text-sm
                                        font-medium
                                        shadow-2xl
                                        opacity-0
                                        invisible
                                        group-hover:opacity-100
                                        group-hover:visible
                                        transition-all
                                        duration-200
                                        z-50
                                    "
                                >
                                    Tutup Sidebar

                                </div>
                            </div>
                        </>

                    )}

                </div>

                {/* User */}

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
                            {user?.nama || "Administrator"}
                        </p>

                        <p className="text-sm text-slate-400 mt-1">
                            {user?.jabatan || "Admin"}
                        </p>

                    </div>

                )}

            </div>


            <div className="flex-1 px-3 py-4 space-y-1">

                {menus.map((menu) => {

                    const Icon = menu.icon;

                    const active =
                        location.pathname === menu.path;

                    return (

                        <div
                            key={menu.path}
                            className="relative group"
                        >

                            <Link
                                to={menu.path}
                                className={`
                                    flex
                                    items-center
                                    ${collapsed
                                        ? "justify-center"
                                        : "gap-3"
                                    }
                                    h-11
                                    px-3
                                    rounded-xl
                                    transition-all
                                    duration-200
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

                            {/* Tooltip */}

                            {collapsed && (

                                <div
                                    className="
                                        absolute
                                        left-16
                                        top-1/2
                                        -translate-y-1/2
                                        whitespace-nowrap
                                        rounded-lg
                                        bg-slate-900/95
                                        backdrop-blur-md
                                        px-3
                                        py-2
                                        text-sm
                                        font-medium
                                        shadow-2xl
                                        opacity-0
                                        invisible
                                        group-hover:opacity-100
                                        group-hover:visible
                                        transition-all
                                        duration-200
                                        z-50
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
                        onClick={logout}
                        className="
                            w-full
                            h-11

                            flex
                            items-center
                            justify-center
                            gap-3
                            rounded-xl
                            bg-red-600
                            hover:bg-red-700
                            transition
                            cursor-pointer
                        "
                    >

                        <LogOut size={20} />

                        {!collapsed && (

                            <span>

                                Logout

                            </span>

                        )}

                    </button>

                    {collapsed && (

                        <div
                            className="
                                absolute
                                left-16
                                top-1/2
                                -translate-y-1/2
                                whitespace-nowrap
                                rounded-lg
                                border
                                border-slate-700
                                bg-slate-900/95
                                backdrop-blur-md
                                px-3
                                py-2
                                text-sm
                                font-medium
                                shadow-2xl
                                opacity-0
                                invisible
                                group-hover:opacity-100
                                group-hover:visible
                                transition-all
                                duration-200
                                z-50
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