import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../api/axios";
import Navbar from "../components/layout/Navbar";
import HeroSlider from "../components/home/HeroSlider";
import ServiceAccordion from "../components/home/ServiceAccordion";
import Footer from "../components/home/Footer";

import {
    ChevronDown,
    ChevronUp
} from "lucide-react";

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

    const banners = [
        {
            image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1920&q=80",
            title: "Banner 1",
            description: "Deskripsi banner 1"
        },
        {
            image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1920&q=80water",
            title: "Banner 2",
            description: "Deskripsi banner 2"
        },
        {
            image: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=1920&q=80",
            title: "Banner 3",
            description: "Deskripsi banner 3"
        },
        {
            image: "https://source.unsplash.com/1600x900/?nature,water",
            title: "Banner 3",
            description: "Deskripsi banner 4"
        },
        {
            image: "https://source.unsplash.com/1600x900/?nature,water",
            title: "Banner 3",
            description: "Deskripsi banner 3"
        }
    ]

    
    if (!setting) {

        return (

            <div className="min-h-screen flex items-center justify-center">

                Loading...

            </div>

        );

    }

    return (

        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">

            <Navbar />

            {/* HERO */}

            <HeroSlider 
                banners={banners}
                primaryColor={setting.primary_color}
            />

            <ServiceAccordion menus={menus} />

            <Footer />

        </div>

    );

}