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
    BadgeCheck,
} from "lucide-react";

import Badge from "../ui/Badge";

import ActivityLog from "./ActivityLog";
import { getUserActivities } from "../../services/userService";

export default function UserDetailModal({

    user,
    onClose,
    onDisable,
    onEnable

}) {

    if (!user) return null;

    console.log("user.activity_logs:", user.activity_logs);
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
                onClick={(e) => e.stopPropagation()}
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
                        border-b-2
                        border-slate-200
                    "
                >

                    <div>

                        <h2 className="text-2xl font-bold">

                            Detail Pengguna

                        </h2>

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

                <div className="p-6 grid grid-cols-2 gap-6 border-b-2 border-slate-200">

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
                        label="Tanggal Disable"
                        value={
                            user.tgldisabled
                                ? new Date(user.tgldisabled).toLocaleDateString()
                                : "-"
                        }
                    />

                    <InfoItem
                        icon={<Shield size={18} />}
                        label="Status"
                    >

                        <Badge
                            color={
                                user.sts === "aktif"
                                    ? "green"
                                    : "red"
                            }
                        >
                            {user.sts}
                        </Badge>

                    </InfoItem>

                    <InfoItem
                        icon={<BadgeCheck size={18} />}
                        label="Approval"
                    >
                        <Badge
                            color={
                                user.approval === "approved"
                                    ? "green"
                                    : "red"
                            }
                        >
                            {user.approval}
                        </Badge>
                    </InfoItem>                

                </div>

                {/* Activity Log */}

                <ActivityLog
                    key={`${user.id}-${user.activity_logs?.length ?? 0}`}
                    logs={user.activity_logs ?? []}
                    userId={user.id}
                    fetchPage={getUserActivities}
                />

                {/* Footer */}

                <div
                    className="
                        px-6
                        py-4
                        border-t-2
                        border-slate-200
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

                </div>

            </div>

        </div>

    );

}

function InfoItem({

    icon,
    label,
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

                <span>{label}</span>

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
