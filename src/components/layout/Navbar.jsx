import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
    Menu,
    X,
    User,
    LogOut,
    Settings
} from "lucide-react";

const navMenus = [
    { label: "Home",    id: "home" },
    { label: "Layanan", id: "layanan" },
    { label: "Tentang", id: "tentang" },
    { label: "Kontak",  id: "kontak" },
];

export default function Navbar() {

    const navigate = useNavigate();

    const [scrolled, setScrolled]       = useState(false);
    const [mobileOpen, setMobileOpen]   = useState(false);
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
            if ( menuRef.current && !menuRef.current.contains(event.target)) {
                setProfileMenu(false);
            }
        }
        document.addEventListener("click", handleClickOutside);
        return () => { document.removeEventListener("click", handleClickOutside);};
    }, []);

    function logout() {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

    }

    function handleNavClick(e, id) {
        e.preventDefault();
        setMobileOpen(false);

        if (id === "home") {
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: "smooth" });
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

                    {navMenus.map((menu) => (
                        <a
                            key={menu.id}
                            href={`#${menu.id}`}
                            onClick={(e) => handleNavClick(e, menu.id)}
                            className={`
                                font-medium 
                                transition 
                                hover:text-red-500                                
                                ${scrolled ? "text-slate-700" : "text-white"}
                            `}
                        >
                            {menu.label}
                        </a>
                    ))}
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
                                        shadow-xl
                                        overflow-hidden
                                        z-50
                                    "
                                >
                                
                                    <button
                                        onClick={() => navigate("/profile")}
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
                                            hover:bg-red-400 
                                            transition
                                            cursor-pointer
                                            outline-red
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
                        {navMenus.map((menu) => (
                            <a
                                key={menu.id}
                                href={`#${menu.id}`}
                                onClick={(e) => handleNavClick(e, menu.id)}
                                className="
                                    font-medium
                                    text-slate-700
                                    hover:text-red-500
                                    transition
                                    cursor-pointer"
                            >
                                {menu.label}
                            </a>
                        ))}

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
                                            navigate("/profile");
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

        </header>

    );

}