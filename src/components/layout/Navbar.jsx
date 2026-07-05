import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
    Menu,
    X,
    User,
    LogOut,
    Settings
} from "lucide-react";
import UserDrawer from "./UserDrawer";

import {
    sendDisableOtp,
    disableAccount
} from "../../services/userService";

import { logout as logoutApi } from "../../services/authService";

import Swal from "sweetalert2";
export default function Navbar() {

    const navigate = useNavigate();

    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const [drawerOpen, setDrawerOpen] = useState(false);    
    const [profileMenu, setProfileMenu] = useState(false);

    const menuRef = useRef(null);
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


    useEffect(() => {

        function handleClickOutside(event) {

            if (
                menuRef.current &&
                !menuRef.current.contains(event.target)
            ) {

                setProfileMenu(false);

            }

        }

        document.addEventListener(
            "click",
            handleClickOutside
        );

        return () => {
            document.removeEventListener(
                "click",
                handleClickOutside
            );
        };
    }, []);

    function logout() {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setDrawerOpen(false);
        setProfileMenu(false);

        navigate("/");

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
                    className="
                        flex
                        items-center
                        gap-3
                    "
                >

                    <div
                        className={`
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
                            font-bold
                            text-lg
                            ${
                                scrolled
                                    ? "text-slate-700"
                                    : "text-white"
                            }
                        `}
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
                                    hover:text-red-500
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
                    ref={menuRef}
                    className="relative"
                >

                    {user ? (
                        <>

                            <button
                                onClick={() => setProfileMenu(!profileMenu)}
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

                            {profileMenu && (
                                <div
                                    className="
                                        absolute
                                        right-0
                                        mt-3
                                        w-56
                                        rounded-2xl
                                        bg-white/80
                                        backdrop-blur-xl
                                        border
                                        border-slate-200
                                        shadow-xl
                                        overflow-hidden
                                        z-50
                                    "
                                >
                                
                                    <button
                                        onClick={() => {
                                            setDrawerOpen(true);
                                            setProfileMenu(false);
                                        }}
                                        className="
                                            w-full
                                            flex
                                            items-center
                                            gap-3
                                            px-4
                                            py-3
                                            hover:bg-slate-100
                                            transition
                                            cursor-pointer
                                        "
                                    >
                                        <User size={18}/>
                                        Profil
                                    </button>
                                    
                                    <button
                                        onClick={() => {
                                            navigate("/setting");
                                            setProfileMenu(false);
                                        }}
                                        className="
                                            w-full
                                            flex
                                            items-center
                                            gap-3
                                            px-4
                                            py-3
                                            hover:bg-slate-100
                                            transition
                                            cursor-pointer
                                        "
                                    >
                                        <Settings size={18}/>
                                        Ganti Banner
                                    </button>
                                    
                                    <hr />
                                    
                                    <button
                                        onClick={() => {
                                            logout();
                                            setProfileMenu(false);
                                        }}
                                        className="
                                            w-full
                                            flex
                                            items-center
                                            gap-3
                                            px-4
                                            py-3
                                            hover:bg-slate-100
                                            transition
                                            cursor-pointer
                                        "
                                    >
                                        <LogOut size={18}/>
                                        Logout
                                    </button>
                                    
                                </div>
                            )}
                        </>

                    ) : (

                        <button
                            onClick={() => navigate("/login")}
                            className="
                                w-full
                                font-semibold
                                bg-gradient-to-r
                                from-blue-600
                                to-cyan-500
                                hover:from-blue-700
                                hover:to-cyan-600
                                text-white
                                rounded-lg
                                p-2
                                cursor-pointer
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

                        {!user ? (

                        <>
                            <a 
                                href="/login"
                                className="
                                font-semibold
                                text-blue-700
                                hover:text-blue-500
                                transition
                                cursor-pointer
                                "
                            >
                                Login
                            </a>

                        </>

                    ) : (

                        <div
                            ref={menuRef} 
                            className="relative"
                        >
                            <button
                                onClick={() => setProfileMenu(!profileMenu)}                                
                                className={`
                                    w-11
                                    h-11
                                    rounded-xl
                                    flex
                                    items-center
                                    justify-center
                                    transition
                                    cursor-pointer
                                    ${
                                        scrolled
                                            ? "bg-slate-100 hover:bg-slate-200"
                                            : "bg-white/20 hover:bg-white/30 backdrop-blur"
                                    }
                                `}
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

                            {profileMenu && (
                                <div
                                    className="
                                        absolute
                                        right-0
                                        mt-3
                                        w-56
                                        bg-white
                                        rounded-xl
                                        shadow-xl
                                        border-slate
                                        overflow-hidden
                                        z-50
                                    "
                                >
                                    <button
                                        onClick={() => {
                                            setDrawerOpen(true);
                                            setProfileMenu(false);
                                        }}
                                        className="
                                            w-full
                                            flex
                                            items-center
                                            gap-3
                                            px-4
                                            py-3
                                            hover:bg-slate-100
                                            transition
                                            cursor-pointer
                                        "
                                    >
                                        <User size={18} />
                                        
                                        Profil 

                                    </button>

                                    <button
                                        onClick={() => {
                                            navigate("/content");
                                            setProfileMenu(false);
                                        }}
                                        className="
                                            w-full
                                            flex
                                            items-center
                                            gap-3
                                            px-4
                                            py-3
                                            hover:bg-slate-100
                                            transition
                                            cursor-pointer
                                        "
                                    >
                                        <Settings size={18} />
                                        Ganti Banner

                                    </button>

                                    <hr />

                                    <button
                                        onClick={() => {
                                            logout();
                                            setProfileMenu(false);
                                        }}
                                        className="
                                            w-full
                                            flex
                                            items-center
                                            gap-3
                                            px-4
                                            py-3
                                            text-red-500
                                            hover:bg-red-300
                                            transition
                                            cursor-pointer
                                        "
                                    >
                                        <LogOut size={18} />
                                        Logout

                                    </button>

                                </div>
                            )}

                        </div>
                        
                    )}


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