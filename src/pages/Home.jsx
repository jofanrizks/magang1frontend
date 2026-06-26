import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/layout/Navbar";


export default function Home() {
    const [setting, setSetting] = useState(null);
    const [openMenu, setOpenMenu] = useState({});

    useEffect(() => {
        getSetting();
    }, []);

    async function getSetting() {
        try {
            const res = await api.get("/settings");
            setSetting(res.data);
        } catch (err) {
            console.log(err);
        }
    }

    const menus = [
        {
            title: "Layanan 1",
            items: [
                { id: 1, name: "Menu 1", path: "/menu/1" },
                { id: 2, name: "Menu 2", path: "/menu/2" },
                { id: 3, name: "Menu 3", path: "/menu/3" },
                { id: 4, name: "Menu 4", path: "/menu/4" }
            ]
        },
        {
            title: "Layanan 2",
            items: [
                { id: 5, name: "Menu 5", path: "/menu/5" },
                { id: 6, name: "Menu 6", path: "/menu/6" },
                { id: 7, name: "Menu 7", path: "/menu/7" },
                { id: 8, name: "Menu 8", path: "/menu/8" }
            ]
        },
        {
            title: "Layanan 3",
            items: [
                { id: 9, name: "Menu 9", path: "/menu/9" },
                { id: 10, name: "Menu 10", path: "/menu/10" },
                { id: 11, name: "Menu 11", path: "/menu/11" },
                { id: 12, name: "Menu 12", path: "/menu/12" }
            ]
        },
        {
            title: "Layanan 4",
            items: [
                { id: 13, name: "Menu 13", path: "/menu/13" },
                { id: 14, name: "Menu 14", path: "/menu/14" },
                { id: 15, name: "Menu 15", path: "/menu/15" },
                { id: 16, name: "Menu 16", path: "/menu/16" }
            ]
        },
        {
            title: "Layanan 5",
            items: [
                { id: 17, name: "Menu 17", path: "/menu/17" },
                { id: 18, name: "Menu 18", path: "/menu/18" },
                { id: 19, name: "Menu 19", path: "/menu/19" },
                { id: 20, name: "Menu 20", path: "/menu/20" }
            ]
        }
    ];

    if (!setting) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Loading...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100">
            <Navbar />

            {/* Banner */}
            <section className="max-w-7xl mx-auto px-6 py-8">
                <div className="relative rounded-3xl overflow-hidden shadow-xl">
                    {setting.banner && (
                        <img
                            src={`http://127.0.0.1:8000/storage/${setting.banner}`}
                            alt="Banner"
                            className="w-full h-[450px] object-cover"
                        />
                    )}

                    <div
                        className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6"
                        style={{
                            backgroundColor: `${setting.primary_color}99`
                        }}
                    >
                        <h1 className="text-5xl font-bold mb-4">
                            {setting.hero_title || "Selamat Datang"}
                        </h1>
                    </div>
                </div>
            </section>

            {/* Menu Dropdown */}
            <section className="max-w-7xl mx-auto px-6 pb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-start">
                    {menus.map((menu, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl shadow-md overflow-hidden self-start"
                        >
                            <button
                                onClick={() =>
                                    setOpenMenu({
                                        ...openMenu,
                                        [index]: !openMenu[index]
                                    })
                                }
                                className="
                                    w-full
                                    text-center
                                    px-3
                                    py-4
                                    font-semibold
                                    bg-white
                                    hover:bg-slate-50
                                    text-sm
                                "
                            >
                                <span>{menu.title}</span>

                            </button>

                            {openMenu[index] && (
                                <div className="border-t">
                                    {menu.items.map((item) => (
                                        <Link
                                            key={item.id}
                                            to={item.path}
                                            className="
                                                block
                                                px-3
                                                py-2
                                                text-sm
                                                hover:bg-slate-100
                                            "
                                        >
                                            {item.name}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}