import {
    X,
    User,
    IdCard,
    Briefcase,
    Building2,
    Phone,
    Mail,
    Calendar,
    Shield,
    BadgeCheck
} from "lucide-react";

import Badge from "../ui/Badge";

export default function UserDetailModal({

    user,
    onClose

}) {

    if (!user) return null;

    return (

        <div
            className="
                fixed
                inset-0
                bg-black/50
                flex
                items-center
                justify-center
                z-50
            "
        >

            <div
                className="
                    bg-white
                    rounded-2xl
                    shadow-xl
                    w-full
                    max-w-2xl
                    overflow-hidden
                "
            >

                {/* Header */}

                <div
                    className="
                        flex
                        items-center
                        justify-between
                        px-6
                        py-5
                        border-b
                    "
                >

                    <div>

                        <h2 className="text-2xl font-bold">

                            Detail Pengguna

                        </h2>

                        <p className="text-gray-500 text-sm mt-1">

                            Informasi lengkap pengguna

                        </p>

                    </div>

                    <button

                        onClick={onClose}

                        className="
                            p-2
                            rounded-lg
                            hover:bg-gray-100
                            transition
                            cursor-pointer
                        "

                    >

                        <X size={22} />

                    </button>

                </div>

                {/* Body */}

                <div className="p-6 grid grid-cols-2 gap-6">

                    <InfoItem
                        icon={<User size={18} />}
                        label="Nama"
                        value={user.nama}
                    />

                    <InfoItem
                        icon={<IdCard size={18} />}
                        label="NIK"
                        value={user.nik}
                    />

                    <InfoItem
                        icon={<Briefcase size={18} />}
                        label="Jabatan"
                        value={user.jabatan}
                    />

                    <InfoItem
                        icon={<Building2 size={18} />}
                        label="Instansi"
                        value={user.instansi}
                    />

                    <InfoItem
                        icon={<Phone size={18} />}
                        label="No HP"
                        value={user.telp}
                    />

                    <InfoItem
                        icon={<Mail size={18} />}
                        label="Email"
                        value={user.email}
                    />

                    <InfoItem
                        icon={<Calendar size={18} />}
                        label="Tanggal Daftar"
                        value={
                            new Date(
                                user.tgldaftar
                            ).toLocaleDateString("id-ID")
                        }
                    />

                    <div>

                        <div className="flex items-center gap-2 text-gray-500 mb-2">

                            <Shield size={18} />

                            <span>Status</span>

                        </div>

                        <Badge
                            color={
                                user.sts === "aktif"
                                    ? "green"
                                    : "red"
                            }
                        >

                            {user.sts}

                        </Badge>

                    </div>

                    <div>

                        <div className="flex items-center gap-2 text-gray-500 mb-2">

                            <BadgeCheck size={18} />

                            <span>Approval</span>

                        </div>

                        <Badge
                            color={
                                user.approval === "approved"
                                    ? "green"
                                    : "yellow"
                            }
                        >

                            {user.approval}

                        </Badge>

                    </div>

                </div>

                {/* Footer */}

                <div
                    className="
                        px-6
                        py-4
                        border-t
                        flex
                        justify-end
                    "
                >

                    <button

                        onClick={onClose}

                        className="
                            px-5
                            py-2
                            rounded-lg
                            bg-red-500
                            text-white
                            hover:bg-red-300
                            cursor-pointer
                        "

                    >

                        Dissable

                    </button>
                    
                </div>

            </div>

        </div>

    );

}

function InfoItem({

    icon,
    label,
    value

}) {

    return (

        <div>

            <div className="flex items-center gap-2 text-gray-500 mb-2">

                {icon}

                <span>{label}</span>

            </div>

            <p className="font-semibold text-slate-800">

                {value || "-"}

            </p>

        </div>

    );

}