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
            onClick={onClose}
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
                    max-w-3xl
                    max-h-[90vh]
                    overflow-y-auto
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
                        label="Tanggal Disabled"
                        value={
                            user.tgldisabled
                                ? new Date(user.tgldisabled).toLocaleString("id-ID")
                                : "-"
                        }
                    />

                    <InfoItem
                        icon={<Calendar size={18} />}
                        label="Tanggal Disable"
                        value={
                            new Date(
                                user.tgldisabled
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
                                    : user.approval === "pending"
                                    ? "yellow"
                                    : "red"
                            }
                        >

                            {user.approval}

                        </Badge>

                    </div>

                </div>

                {/* Activity Log */}

                <div className="px-6 pb-6">

                    <div className="flex items-center gap-2 mb-4">

                        <History size={18} />

                        <h3 className="text-lg font-semibold">

                            Riwayat Aktivitas

                        </h3>

                    </div>

                    <div className="border border-slate-300 rounded-xl overflow-hidden">

                        {

                            user.activity_logs?.length > 0 ? (

                                user.activity_logs.map((log) => (

                                    <div
                                        key={log.id}
                                        className="border border-slate-300 p-3"
                                    >

                                        <div className="flex justify-between items-start">

                                            <div>

                                                <h4 className="font-semibold">
                                                    {log.activity}
                                                </h4>

                                                <p className="text-sm text-slate-500 mt-1">
                                                    IP Address : {log.ip_address ?? "-"}
                                                </p>

                                            </div>

                                            <span className="text-sm font-medium text-slate-500">
                                                {new Date(log.created_at).toLocaleString("id-ID", {
                                                    day: "2-digit",
                                                    month: "long",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </span>

                                        </div>

                                        <p className="text-gray-600 mt-3">
                                            {log.description}
                                        </p>

                                    </div>

                                ))

                            ) : (

                                <div className="p-6 text-center text-gray-400">

                                    Belum ada riwayat aktivitas.

                                </div>

                            )

                        }

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
                        gap-3
                    "
                >

                    {
                        user.sts === "aktif" ? (

                            <button
                                onClick={() => onDisable(user.id)}
                                className="
                                    px-5
                                    py-2
                                    rounded-lg
                                    bg-red-600
                                    text-white
                                    hover:bg-red-700
                                    transition
                                    cursor-pointer
                                "
                            >

                                Disable User

                            </button>

                        ) : (

                            <button
                                onClick={() => onEnable(user.id)}
                                className="
                                    px-5
                                    py-2
                                    rounded-lg
                                    bg-green-600
                                    text-white
                                    hover:bg-green-700
                                    transition
                                    cursor-pointer
                                "
                            >

                                Enable User

                            </button>

                        )
                    }

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