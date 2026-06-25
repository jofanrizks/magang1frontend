import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Sidebar() {

    const location = useLocation();
    const navigate = useNavigate();

    const menus = [
        {
            name: "Dashboard",
            path: "/dashboard"
        },
        {
            name: "Pending User",
            path: "/pending-users"
        },
        {
            name: "Approved User",
            path: "/approved-users"
        },
        {
            name: "Profile",
            path: "/profile"
        }
    ];

    function logout() {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");

    }

    return (

        <div
            className="
                w-64
                bg-slate-900
                text-white
                min-h-screen
                p-5
                flex
                flex-col
            "
        >

            <div>

                <h1
                    className="
                        text-2xl
                        font-bold
                        mb-10
                    "
                >
                    Admin Panel
                </h1>

                <div className="space-y-2">

                    {menus.map((menu) => (

                        <Link
                            key={menu.path}
                            to={menu.path}
                            className={`
                                block
                                p-3
                                rounded-xl
                                transition
                                ${
                                    location.pathname === menu.path
                                        ? "bg-blue-600"
                                        : "hover:bg-slate-700"
                                }
                            `}
                        >
                            {menu.name}
                        </Link>

                    ))}

                </div>

            </div>

            <div className="mt-auto">

                <button
                    onClick={logout}
                    className="
                        w-full
                        bg-red-600
                        hover:bg-red-700
                        py-3
                        rounded-xl
                        font-semibold
                    "
                >
                    Logout
                </button>

            </div>

        </div>

    );

}