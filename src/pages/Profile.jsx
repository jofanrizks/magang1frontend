import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { me } from "../services/authService";

import {
    ArrowLeft,
    Building2,
    Briefcase,
    Phone,
    IdCard,
    Calendar,
    Shield,
    BadgeCheck,
    Ban,
    User,
} from "lucide-react";

import Badge from "../components/ui/Badge";
import ActivityLog from "../components/dashboard/ActivityLog";
import useDisableAccount from "../hooks/useDisableAccount";

export default function Profile() {

    const navigate = useNavigate();

    const [user, setUser] = useState(null);

    const { handleDisable } = useDisableAccount(logout);

    function logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    }
        

    useEffect(() => {

        async function loadProfile() {

            try {

                const res = await me();

                setUser(res.data.data);

            } catch (err) {

                console.log(err);

                navigate("/login");

            }

        }

        loadProfile();

    }, [navigate]);

    if (!user) return null;

    return (

        <div className="min-h-screen bg-slate-50">

            <div className="max-w-7xl mx-auto px-8 py-8">

                {/* Header */}
                <div
                    className="
                        sticky
                        top-0
                        flex
                        z-10
                        items-center
                        gap-4
                        mb-2
                        py-5
                        backdrop-blur-xs
                    "
                >

                    <button
                        onClick={() => navigate(-1)}
                        className="
                            w-11
                            h-11
                            rounded-xl
                            border
                            border-slate-200
                            bg-white
                            hover:bg-slate-100
                            transition
                            flex
                            items-center
                            justify-center
                            cursor-pointer
                        "
                    >
                        <ArrowLeft size={20}/>
                    </button>

                    <div>

                        <h1 className="text-4xl font-bold text-slate-800">
                            Profil
                        </h1>

                        <p className="text-slate-500 mt-2">
                            Informasi akun dan riwayat aktivitas.
                        </p>

                    </div>

                </div>


                {/* Profile */}

                <div 
                    className="
                        bg-white
                        rounded-3xl
                        border
                        border-slate-200
                        shadow-sm
                        overflow-hidden
                        mb-8
                    "
                >

                    <div className="h-24"/>

                    <div className="px-8 pb-8">

                        <div className="-mt-14 flex items-end gap-6">

                            <div
                                className="
                                    w-20
                                    h-20
                                    rounded-full
                                    bg-white
                                    shadow-xl
                                    border-4
                                    border-white
                                    flex
                                    items-center
                                    justify-center
                                "
                            >
                                <User
                                                                    
                                ></User>

                            </div>

                            <div className="pb-3">

                                <h2 className="text-3xl font-bold">

                                    {user.nama}

                                </h2>

                                <p className="text-slate-500">

                                    {user.jabatan}

                                </p>

                            </div>

                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">

                        <Info
                                icon={<User size={18}/>}
                                title="Nama"
                                value={user.nama}
                            />

                            <Info
                                icon={<IdCard size={18}/>}
                                title="NIK"
                                value={user.nik}
                            />

                            <Info
                                icon={<Building2 size={18}/>}
                                title="Instansi"
                                value={user.instansi}
                            />

                            <Info
                                icon={<Briefcase size={18}/>}
                                title="Jabatan"
                                value={user.jabatan}
                            />

                            <Info
                                icon={<Phone size={18}/>}
                                title="Nomor HP"
                                value={user.telp}
                            />

                            <Info
                                icon={<Calendar size={18}/>}
                                title="Tanggal Daftar"
                                value={
                                    user.tgldaftar
                                        ? new Date(user.tgldaftar).toLocaleDateString("id-ID", {
                                            day: "2-digit",
                                            month: "long",
                                            year: "numeric",
                                        })
                                        : "-"
                                }
                            />

                            <Info
                                icon={<Shield size={18}/>}
                                title={"Status"}
                            >

                                <Badge
                                    color={user.sts === "aktif" ? "green" : "red"}
                                >
                                    {user.sts}
                                </Badge>
                            </Info>

                            <Info
                                icon={<BadgeCheck size={18}/>}
                                title={"Approval"}
                            >
                                
                                <Badge
                                    color={user.approval === "approved" ? "green" : "yellow"}
                                >
                                    {user.approval}
                                </Badge>
                            </Info>

                        </div>

                    </div>

                </div>

                {/* Activity */}

                <div 
                    className="
                    bg-white
                    rounded-3xl
                    border
                    border-slate-200
                    shadow-sm 
                    mb-8">

                    <ActivityLog
                        logs={user.activity_logs ?? []}
                    />

                </div>

                {/* Danger Zone */}

                <div className="flex justify-end mt-8">

                    <button
                        onClick={() => handleDisable(logout)}
                        className="
                            flex
                            items-center
                            gap-2
                            px-5
                            py-3
                            rounded-xl
                            border
                            bg-red-600
                            text-white
                            hover:bg-red-500
                            transition
                            cursor-pointer
                        "
                    >
                        <Ban size={18}/>
                        Disable Account
                    </button>

                </div>

            </div>

        </div>

    );

}

function Info({

    icon,
    title,
    value,
    children

}) {

    return (

        <div
            className="
                py-3
                border-b
                border-slate-200
            "
        >

            <div className="flex items-center gap-2 text-slate-500 mb-3 pl-2">

                {icon}

                <span>{title}</span>

            </div>

            {children ? (
                children
            ) : (

            <div className="text-lg font-semibold text-slate-800 pl-2">

                {value || "-"}
            </div>
            )}
            
        </div>

    );

}