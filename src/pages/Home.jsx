import { useEffect, useState } from "react";
import Navbar from "../components/layout/Navbar";
import HeroSlider from "../components/home/HeroSlider";
import ServiceAccordion from "../components/home/ServiceAccordion";
import Footer from "../components/home/Footer";
import { useNavigate } from "react-router-dom";
import { getServices } from "../services/serviceService";

function storedUser() {
    try {
        return JSON.parse(localStorage.getItem("user"));
    } catch (error) {
        console.error("Stored user data is invalid.", error);
        return null;
    }
}

export default function Home() {

    const primaryColor = "#2563eb";
    const navigate = useNavigate();

    const [currentUser, setCurrentUser] = useState(storedUser);
    const loadingUser = false;
    const [menus, setMenus] = useState([]);
    const [loadingServices, setLoadingServices] = useState(false);
    const [serviceError, setServiceError] = useState("");

    useEffect(() => {
        const mustChangePassword =
            currentUser?.must_change_password === true ||
            currentUser?.must_change_password === 1 ||
            currentUser?.must_change_password === "1";

        if (mustChangePassword) {
            navigate("/change-password-required", {
                replace: true
            });
        }
    }, [
        currentUser,
        navigate
    ]);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            return;
        }

        async function fetchServices() {
            setLoadingServices(true);
            setServiceError("");

            try {
                const response = await getServices();

                setMenus(response.data.data ?? []);
            } catch (err) {
                if (err.response?.status === 401) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    setCurrentUser(null);
                }

                setMenus([]);
                setServiceError(
                    err.response?.data?.message ??
                        "Gagal mengambil layanan."
                );
            } finally {
                setLoadingServices(false);
            }
        }

        fetchServices();
    }, [currentUser?.id]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
            <Navbar />

            <HeroSlider primaryColor={primaryColor} />

            <ServiceAccordion
                menus={menus}
                currentUser={currentUser}
                loadingUser={loadingUser || loadingServices}
                serviceError={serviceError}
            />

            <Footer />
        </div>
    );
}
