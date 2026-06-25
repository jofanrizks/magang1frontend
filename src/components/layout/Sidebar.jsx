import { Link } from "react-router-dom";

export default function Sidebar() {

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

    return (

        <div className="w-64 bg-slate-900 text-white min-h-screen p-5">

            <h1 className="text-2xl font-bold mb-10">
                Magang
            </h1>

            <div className="space-y-3">

                {
                    menus.map(menu => (

                        <Link
                            key={menu.path}
                            to={menu.path}
                            className="block p-3 rounded-xl hover:bg-slate-700"
                        >
                            {menu.name}
                        </Link>

                    ))
                }

            </div>

        </div>

    );
}