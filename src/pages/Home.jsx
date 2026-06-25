import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/layout/Navbar";

export default function Home() {

    const [setting, setSetting] = useState(null);

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


        </div>

    );

}