import {
    BadgeCheck,
    Ban,
    Briefcase,
    Building2,
    Calendar,
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-xl">
                <div className="flex items-center justify-between border-b px-6 py-5">
                    <div>
                        <h2 className="text-2xl font-bold">
                            Detail Pengguna
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Informasi lengkap pengguna
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="cursor-pointer rounded-lg p-2 transition hover:bg-gray-100"
                        title="Tutup"
                    >
                        <X size={22} />
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
                    <InfoItem icon={<User size={18} />} label="Nama" value={user.nama} />
                    <InfoItem icon={<IdCard size={18} />} label="NIK" value={user.nik} />
                    <InfoItem icon={<Shield size={18} />} label="Role" value={user.role} />
                    <InfoItem icon={<Users size={18} />} label="Group" value={groupName(user)} />
                    <InfoItem icon={<Building2 size={18} />} label="Instansi" value={user.instansi} />
                    <InfoItem icon={<Briefcase size={18} />} label="Jabatan" value={user.jabatan} />
                    <InfoItem icon={<Phone size={18} />} label="No HP" value={user.telp} />
                    <InfoItem icon={<Calendar size={18} />} label="Tanggal Daftar" value={formatDateTime(user.tgldaftar)} />
                    <InfoItem icon={<Calendar size={18} />} label="Tanggal Approval" value={formatDateTime(user.tglapproval)} />
                    <InfoItem icon={<Calendar size={18} />} label="Tanggal Disabled" value={formatDateTime(user.tgldisabled)} />
                    <InfoItem icon={<KeyRound size={18} />} label="Login Attempt" value={user.login_attempt ?? 0} />
                    <InfoItem
                        icon={<KeyRound size={18} />}
                        label="Must Change Password"
                        value={user.must_change_password ? "Ya" : "Tidak"}
                    />

                    <div>
                        <div className="mb-2 flex items-center gap-2 text-gray-500">
                            <Shield size={18} />
                            <span>Status Akun</span>
                        </div>

                        <Badge color={statusColor(user.sts)}>
                            {user.sts ?? "-"}
                        </Badge>
                    </div>

                    <div>
                        <div className="mb-2 flex items-center gap-2 text-gray-500">
                            <BadgeCheck size={18} />
                            <span>Approval</span>
                        </div>

                        <Badge color={approvalColor(user.approval)}>
                            {user.approval ?? "-"}
                        </Badge>
                    </div>

                    <div className="md:col-span-2">
                        <InfoItem
                            icon={<XCircle size={18} />}
                            label="Alasan Penolakan"
                            value={user.rejection_reason ?? "-"}
                        />
                    </div>
                </div>

                <div className="px-6 pb-6">
                    <div className="mb-4 flex items-center gap-2">
                        <History size={18} />
                        <h3 className="text-lg font-semibold">
                            Riwayat Aktivitas
                        </h3>
                    </div>

                    <div className="overflow-hidden rounded-xl border">
                        {user.activity_logs?.length > 0 ? (
                            user.activity_logs.map((log) => (
                                <div key={log.id} className="border-b p-4 last:border-b-0">
                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                        <div>
                                            <h4 className="font-semibold">
                                                {log.activity}
                                            </h4>

                                            <p className="mt-1 text-sm text-slate-500">
                                                Actor: {log.actor?.nama ?? "-"}
                                            </p>
                                        </div>

                                        <span className="text-sm font-medium text-slate-500">
                                            {formatDateTime(log.created_at)}
                                        </span>
                                    </div>

                                    <p className="mt-3 text-gray-600">
                                        {log.description}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <div className="p-6 text-center text-gray-400">
                                Belum ada riwayat aktivitas.
                            </div>
                        )}
                    </div>
                </div>

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

                    <button
                        type="button"
                        onClick={onClose}
                        className="cursor-pointer rounded-lg bg-slate-700 px-5 py-2 text-white transition hover:bg-slate-800"
                    >
                        Tutup
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
            <div className="mb-2 flex items-center gap-2 text-gray-500">
                {icon}
                <span>{label}</span>
            </div>

            <p className="font-semibold text-slate-800">
                {value || "-"}
            </p>
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

function groupName(user) {
    return user.role === "user"
        ? user.group?.name ?? "-"
        : "-";
}

function statusColor(status) {
    if (status === "aktif") return "green";
    if (status === "disabled") return "red";
    return "yellow";
}

function approvalColor(approval) {
    if (approval === "approved") return "green";
    if (approval === "pending") return "yellow";
    return "red";
}

function formatDateTime(value) {
    return value
        ? new Date(value).toLocaleString("id-ID")
        : "-";
}

function isLoading(actionLoading, action, user) {
    return actionLoading === user.id ||
        actionLoading === `${action}-${user.id}`;
}
