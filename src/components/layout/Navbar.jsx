import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Menu,
    X,
    User,
    LogOut
} from "lucide-react";
import UserDrawer from "./UserDrawer";
import {
    sendDisableOtp,
    disableAccount
} from "../../services/userService";

import Swal from "sweetalert2";
export default function Navbar() {

    const navigate = useNavigate();

    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);    

    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {

        function handleScroll() {

            setScrolled(window.scrollY > 40);

        }

        window.addEventListener("scroll", handleScroll);

        return () =>
            window.removeEventListener(
                "scroll",
                handleScroll
            );

    }, []);

    function logout() {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");

    }
    
    async function handleDisableAccount() {

        const { value: password } = await Swal.fire({
            title: "Disable Account",
            text: "Masukkan password untuk melanjutkan",
            input: "password",
            inputPlaceholder: "Password",
            showCancelButton: true,
            confirmButtonText: "Kirim OTP",
            cancelButtonText: "Batal"
        });

        if (!password) return;

        try {

            await sendDisableOtp(password);

            while (true) {

                const { value: otp, isDismissed } = await Swal.fire({
                    title: "Verifikasi OTP",
                    text: "Masukkan kode OTP yang dikirim ke WhatsApp",
                    input: "text",
                    inputPlaceholder: "4 Digit OTP",
                    showCancelButton: true,
                    confirmButtonText: "Disable Account",
                    cancelButtonText: "Batal",
                    allowOutsideClick: false
                });

                if (isDismissed) return;

                if (!otp) continue;

                try {

                    await disableAccount(otp);

                    await Swal.fire({
                        icon: "success",
                        title: "Berhasil",
                        text: "Akun berhasil dinonaktifkan."
                    });

                    logout();
                    return;

                } catch (err) {

                    await Swal.fire({
                        icon: "error",
                        title: "OTP Salah",
                        text:
                            err.response?.data?.message ??
                            "OTP tidak valid atau sudah expired."
                    });

                }

            }

        } catch (err) {

            Swal.fire({
                icon: "error",
                title: "Gagal",
                text:
                    err.response?.data?.message ??
                    "Terjadi kesalahan."
            });

        }

    }

    return (

        <header
            className={`
                fixed
                top-0
                left-0
                w-full
                z-50
                transition-all
                duration-300
                ${
                    scrolled
                        ? `
                            bg-white/90
                            backdrop-blur-xl
                            shadow-md
                            py-3
                          `
                        : `
                            bg-transparent
                            py-5
                          `
                }
            `}
        >

            <div
                className="
                    max-w-7xl
                    mx-auto
                    px-6
                    flex
                    items-center
                    justify-between
                "
            >

                {/* Logo */}

                <div
                    to="/"
                    className="
                        flex
                        items-center
                        gap-3
                    "
                >

                    <div
                        className="
                            w-11
                            h-11
                            rounded-xl
                            bg-blue-600
                            text-white
                            flex
                            items-center
                            justify-center
                            font-bold
                            text-lg
                        "
                    >

                        S

                    </div>

                </div>

                {/* Desktop Menu */}

                <nav
                    className="
                        hidden
                        lg:flex
                        items-center
                        gap-10
                    "
                >

                    {
                        [
                            "Home",
                            "Layanan",
                            "Tentang",
                            "Kontak"
                        ].map((menu) => (

                            <a
                                key={menu}
                                href="#"
                                className={`
                                    font-medium
                                    transition
                                    hover:text-blue-600
                                    ${
                                        scrolled
                                            ? "text-slate-700"
                                            : "text-white"
                                    }
                                `}
                            >

                                {menu}

                            </a>

                        ))
                    }

                </nav>

                {/* Right */}

                <div
                    className="
                        hidden
                        lg:flex
                        items-center
                        gap-3
                    "
                >

                    {user ? (

                        <>
                            <button
                                onClick={() => setDrawerOpen(true)}
                                className="
                                    w-11
                                    h-11
                                    rounded-xl
                                    bg-white/20
                                    backdrop-blur
                                    hover:bg-white/30
                                    transition
                                    flex
                                    items-center
                                    justify-center
                                    cursor-pointer
                                "
                            >

                                <User 
                                    size={20}
                                    className={
                                        scrolled
                                            ? "text-slate-700"
                                            : "text-white"
                                    }
                                />

                            </button>

                        </>

                    ) : (

                        <button
                            onClick={() =>
                                navigate("/login")
                            }
                            className="
                                px-6
                                py-2.5
                                rounded-xl
                                bg-blue-600
                                hover:bg-blue-700
                                text-white
                                transition
                            "
                        >

                            Login

                        </button>

                    )}

                </div>

                {/* Mobile */}

                <button
                    onClick={() =>
                        setMobileOpen(!mobileOpen)
                    }
                    className="
                        lg:hidden
                    "
                >

                    {
                        mobileOpen
                            ? <X className={scrolled ? "text-slate-700" : "text-white"} />
                            : <Menu className={scrolled ? "text-slate-700" : "text-white"} />
                    }

                </button>

            </div>

            {/* Mobile Menu */}

            {mobileOpen && (

                <div
                    className="
                        lg:hidden
                        bg-white
                        border-t
                        mt-4
                        items-center
                    "
                >

                    <div
                        className="
                            flex
                            flex-col
                            p-5
                            gap-4
                            
                        "
                    >

                        <a href="#">Home</a>

                        <a href="#">Layanan</a>

                        <a href="#">Tentang</a>

                        <a href="#">Kontak</a>

                        <button
                            onClick={() => setDrawerOpen(true)}
                            className="
                                w-11
                                h-11
                                rounded-xl
                                bg-blue-600
                                hover:scale-105
                                transition
                                flex
                                items-center
                                justify-center
                            "
                        >
                            <User size={20}/>

                        </button>


                    </div>

                </div>

            )}
            
            <UserDrawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                user={user}
                logout={logout}
                disable={handleDisableAccount}
            />

        </header>

    );

}