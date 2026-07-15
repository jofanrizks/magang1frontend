import { useEffect, useState } from "react";
import Navbar from "../components/layout/Navbar";
import HeroSlider from "../components/home/HeroSlider";
import ServiceAccordion from "../components/home/ServiceAccordion";
import Footer from "../components/home/Footer";
import { me } from "../services/authService";
import { useNavigate } from "react-router-dom";

export default function Home() {

    const navigate = useNavigate();

    const [currentUser, setCurrentUser] = useState(null);
    const [loadingUser, setLoadingUser] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) return;

        async function fetchUser() {
            setLoadingUser(true);

            try {
                const response = await me();
                const user = response.data.data ?? response.data.user;

                setCurrentUser(user);

                if (user) {
                    localStorage.setItem("user", JSON.stringify(user));

                    const mustChangePassword =
                        user.must_change_password === true ||
                        user.must_change_password === 1 ||
                        user.must_change_password === "1";

                    if (mustChangePassword) {
                        navigate("/change-password-required", {
                            replace: true
                        });
                    }
                }
            } catch (err) {
                if (err.response?.status === 401) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                }
            } finally {
                setLoadingUser(false);
            }
        }

        fetchUser();
    }, [navigate]);

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

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
            
            <Navbar />
                
            <HeroSlider />

            <ServiceAccordion 
                menus={menus}
                currentUser={currentUser}
                loadingUser={loadingUser}
            
            />

            <Footer />
            
        </div>
    );
}