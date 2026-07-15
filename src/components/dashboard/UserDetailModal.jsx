import {
    BadgeCheck,
    Ban,
    Briefcase,
    Building2,
    CalendarDays,
    CheckCircle2,
    Edit,
    History,
    IdCard,
    KeyRound,
    Phone,
    Send,
    Shield,
    Trash2,
    User,
    Users,
    X,
    XCircle
} from "lucide-react";

import Badge from "../ui/Badge";
import {
    canApproveUser,
    canDeleteUser,
    canDisableUser,
    canEditUser,
    canEnableUser,
    canRejectUser,
    canResetPassword
} from "../../utils/userPermissions";

import ActivityLog from "./ActivityLog";

export default function UserDetailModal({
    user,
    currentUser,
    onClose,
    onEdit,
    onResetPassword,
    onApprove,
    onReject,
    onDisable,
    onEnable,
    onDelete,
    actionLoading
}) {

    if (!user) return null;

    const isDisabled = user.sts === "disabled";

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
                        icon={<Shield size={18} />}
                        label="Role"
                        value={formatRole(user.role)}
                    />

                    <InfoItem
                        icon={<Users size={18} />}
                        label="Group"
                        value={groupName(user)}
                    />

                    <InfoItem
                        icon={<Building2 size={18} />}
                        label="Instansi"
                        value={user.instansi}
                    />

                    <InfoItem
                        icon={<Briefcase size={18} />}
                        label="Jabatan"
                        value={user.jabatan}
                    />

                    <InfoItem
                        icon={<Phone size={18} />}
                        label="No HP"
                        value={user.telp}
                    />

                    <InfoItem
                        icon={<Mail size={18} />}
                        label="Tanggal Daftar"
                        value={formatDateTime(user.tgldaftar)}
                    />

                    <InfoItem
                        icon={<Mail size={18} />}
                        label="Tanggal Approval"
                        value={formatDateTime(user.tglapproval)}
                    />

                    <InfoItem
                        icon={<Calendar size={18} />}
                        label="Tanggal Disable"
                        value={formatDateTime(user.tgldisabled)}                        
                    />

                    <InfoItem
                        icon={<KeyRound size={18} />}
                        label="Login Attempt"
                        value={user.loginattempt ?? 0}                        
                    />

                    <InfoItem
                        icon={<KeyRound size={18} />}
                        label="Must Change Password"
                        value={user.must_change_password ? "Ya" : "Tidak"}                        
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

                    <InfoItem
                        icon={<XCircle size={18} />}
                        label="Alasan Penolakan"
                        value={user.rejection_reason ?? "-"}                        
                    />


                </div>

                {/* Activity Log */}

                <ActivityLog
                    key={`${user.id}-${user.activity_logs?.length ?? 0}`}
                    logs={user.activity_logs ?? []}
                    userId={user.id}
                    fetchPage={getUserActivities}
                />

                {/* Footer */}

                {/* Footer */}
                <div className="flex flex-wrap justify-end gap-3 border-t px-6 py-4">

                    {canEditUser(currentUser, user) && onEdit && (
                        <FooterButton
                            onClick={() => onEdit(user)}
                            disabled={isLoading(actionLoading, "edit", user)}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            <Edit size={16} />
                            Edit
                        </FooterButton>
                    )}

                    {canResetPassword(currentUser, user) && onResetPassword && (
                        <FooterButton
                            onClick={() => onResetPassword(user)}
                            disabled={isLoading(actionLoading, "reset", user)}
                            className="bg-indigo-600 hover:bg-indigo-700"
                        >
                            <KeyRound size={16} />
                            Reset Password
                        </FooterButton>
                    )}

                    {canApproveUser(currentUser, user) && onApprove && (
                        <FooterButton
                            onClick={() => onApprove(user)}
                            disabled={isLoading(actionLoading, "approve", user)}
                            className="bg-emerald-600 hover:bg-emerald-700"
                        >
                            <Send size={16} />
                            Kirim OTP
                        </FooterButton>
                    )}

                    {canRejectUser(currentUser, user) && onReject && (
                        <FooterButton
                            onClick={() => onReject(user)}
                            disabled={isLoading(actionLoading, "reject", user)}
                            className="bg-orange-600 hover:bg-orange-700"
                        >
                            <XCircle size={16} />
                            Reject
                        </FooterButton>
                    )}

                    {((canDisableUser(currentUser, user) && onDisable) ||
                        (canEnableUser(currentUser, user) && onEnable)) && (
                        <FooterButton
                            onClick={() => isDisabled ? onEnable(user) : onDisable(user)}
                            disabled={
                                isLoading(actionLoading, "disable", user) ||
                                isLoading(actionLoading, "enable", user)
                            }
                            className={isDisabled
                                ? "bg-green-600 hover:bg-green-700"
                                : "bg-red-600 hover:bg-red-700"}
                        >
                            {isDisabled ? <CheckCircle2 size={16} /> : <Ban size={16} />}
                            {isDisabled ? "Enable" : "Disable"}
                        </FooterButton>
                    )}

                    {canDeleteUser(currentUser, user) && onDelete && (
                        <FooterButton
                            onClick={() => onDelete(user)}
                            disabled={isLoading(actionLoading, "delete", user)}
                            className="bg-red-700 hover:bg-red-800"
                        >
                            <Trash2 size={16} />
                            Delete
                        </FooterButton>
                    )}
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

function FooterButton({
    children,
    className = "",
    ...props
}) {
    return (
        <button
            type="button"
            className={`
                inline-flex
                cursor-pointer
                items-center
                gap-2
                rounded-lg
                px-4
                py-2
                font-semibold
                text-white
                transition
                disabled:cursor-not-allowed
                disabled:opacity-60
                ${className}
            `}
            {...props}
        >
            {children}
        </button>
    );
}

function formatRole(role) {
    if (role === "super_admin") {
        return "Super Admin";
    }

    if (role === "admin") {
        return "Admin";
    }

    if (role === "viewer") {
        return "Viewer";
    }

    if (role === "user") {
        return "User";
    }

    return role ?? "-";
}

function groupName(user) {
    return user.role === "user"
        ? user.group?.name ?? "-"
        : "-";
}

function formatDateTime(value) {
    return value
        ? new Date(value).toLocaleString("id-ID"
            , {
                day: "2-digit",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }
        )
        : "-";
}

function isLoading(actionLoading, action, user) {

    return actionLoading === user.id ||
        actionLoading === `${action}-${user.id}`;
}
