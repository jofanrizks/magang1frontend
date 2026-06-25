import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/layout/Navbar";
import { Link } from "react-router-dom";

export default function Home() {

    const [setting, setSetting] = useState(null);

    const [openMenu, setOpenMenu] = useState(null);

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
                { id: 4, name: "Menu 4", path: "/menu/4" },
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

                        {/* <p className="text-lg max-w-2xl">
                            {setting.hero_subtitle || "Sistem Pelayanan Digital"}
                        </p> */}

                    </div>

                </div>

            </section>

            <section className="max-w-7xl mx-auto px-6 pb-8">

    {menus.map((menu, index) => (

        <div
            key={index}
            className="bg-white rounded-xl shadow mb-4 overflow-hidden"
        >

            <button
                onClick={() =>
                    setOpenMenu(
                        openMenu === index ? null : index
                    )
                }
                className="
                    w-full
                    text-left
                    px-6
                    py-4
                    font-semibold
                    bg-white
                    hover:bg-slate-50
                "
            >
                {menu.title}
            </button>

            {openMenu === index && (

                <div className="border-t">

                    {menu.items.map((item) => (

                        <Link
                            key={item.id}
                            to={item.path}
                            className="
                                block
                                px-6
                                py-3
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

</section>


        </div>

    );

}