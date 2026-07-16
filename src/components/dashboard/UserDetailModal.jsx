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
import { formatUserGroups } from "../../utils/groups";

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

    const isDisabled =
        user.sts === "disabled";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-4 py-6 backdrop-blur-sm">
            <div className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
                {/* Header */}

                <div className="flex items-center justify-between border-b border-slate-200 px-7 py-5">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 font-bold text-blue-700">
                            {initialName(user.nama)}
                        </div>

                        <div>
                            <h2 className="text-xl font-bold text-slate-900">
                                {user.nama ?? "Detail Pengguna"}
                            </h2>

                            <div className="mt-1 flex flex-wrap items-center gap-2">
                                <span className="text-sm text-slate-500">
                                    {user.nik ?? "-"}
                                </span>

                                <span className="text-slate-300">
                                    •
                                </span>

                                <span className="text-sm capitalize text-slate-500">
                                    {formatRole(user.role)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                        title="Tutup"
                    >
                        <X size={21} />
                    </button>
                </div>

                {/* Body */}

                <div className="flex-1 overflow-y-auto bg-slate-50/70 p-7">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Informasi utama */}

                        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
                            <SectionTitle
                                icon={<User size={19} />}
                                title="Informasi Pengguna"
                            />

                            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
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
                                    label="Nomor Telepon"
                                    value={user.telp}
                                />

                                {user.role === "user" && (
                                    <InfoItem
                                        icon={<Users size={18} />}
                                        label="Group"
                                        value={formatUserGroups(user)}
                                    />
                                )}
                            </div>
                        </section>

                        {/* Status akun */}

                        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <SectionTitle
                                icon={<Shield size={19} />}
                                title="Status Akun"
                            />

                            <div className="mt-5 space-y-5">
                                <StatusItem
                                    icon={<Shield size={17} />}
                                    label="Status"
                                >
                                    <Badge
                                        color={statusColor(
                                            user.sts
                                        )}
                                    >
                                        {statusLabel(
                                            user.sts
                                        )}
                                    </Badge>
                                </StatusItem>

                                <StatusItem
                                    icon={
                                        <BadgeCheck
                                            size={17}
                                        />
                                    }
                                    label="Approval"
                                >
                                    <Badge
                                        color={approvalColor(
                                            user.approval
                                        )}
                                    >
                                        {approvalLabel(
                                            user.approval
                                        )}
                                    </Badge>
                                </StatusItem>

                                <StatusItem
                                    icon={
                                        <KeyRound
                                            size={17}
                                        />
                                    }
                                    label="Wajib Ganti Password"
                                >
                                    <span className="font-semibold text-slate-700">
                                        {user.must_change_password
                                            ? "Ya"
                                            : "Tidak"}
                                    </span>
                                </StatusItem>

                                {Number(
                                    user.login_attempt
                                ) > 0 && (
                                    <StatusItem
                                        icon={
                                            <KeyRound
                                                size={17}
                                            />
                                        }
                                        label="Percobaan Login"
                                    >
                                        <span className="font-semibold text-red-600">
                                            {
                                                user.login_attempt
                                            }
                                        </span>
                                    </StatusItem>
                                )}
                            </div>
                        </section>

                        {/* Tanggal */}

                        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-3">
                            <SectionTitle
                                icon={
                                    <CalendarDays
                                        size={19}
                                    />
                                }
                                title="Informasi Waktu"
                            />

                            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
                                <InfoItem
                                    icon={
                                        <CalendarDays
                                            size={18}
                                        />
                                    }
                                    label="Tanggal Daftar"
                                    value={formatDateTime(
                                        user.tgldaftar
                                    )}
                                />

                                <InfoItem
                                    icon={
                                        <CalendarDays
                                            size={18}
                                        />
                                    }
                                    label="Tanggal Approval"
                                    value={formatDateTime(
                                        user.tglapproval
                                    )}
                                />

                                <InfoItem
                                    icon={
                                        <CalendarDays
                                            size={18}
                                        />
                                    }
                                    label="Tanggal Dinonaktifkan"
                                    value={formatDateTime(
                                        user.tgldisabled
                                    )}
                                />
                            </div>
                        </section>

                        {/* Alasan penolakan */}

                        {user.approval === "rejected" &&
                            user.rejection_reason && (
                                <section className="rounded-2xl border border-orange-200 bg-orange-50 p-5 lg:col-span-3">
                                    <div className="flex items-start gap-3">
                                        <XCircle
                                            size={20}
                                            className="mt-0.5 shrink-0 text-orange-600"
                                        />

                                        <div>
                                            <h3 className="font-semibold text-orange-800">
                                                Alasan Penolakan
                                            </h3>

                                            <p className="mt-2 text-sm leading-6 text-orange-700">
                                                {
                                                    user.rejection_reason
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </section>
                            )}

                        {/* Riwayat */}

                        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-3">
                            <div className="border-b border-slate-200 px-5 py-4">
                                <SectionTitle
                                    icon={
                                        <History
                                            size={19}
                                        />
                                    }
                                    title="Riwayat Aktivitas"
                                />
                            </div>

                            <div className="max-h-80 overflow-y-auto">
                                {user.activity_logs?.length >
                                0 ? (
                                    user.activity_logs.map(
                                        (log) => (
                                            <div
                                                key={
                                                    log.id
                                                }
                                                className="border-b border-slate-100 px-5 py-4 last:border-b-0"
                                            >
                                                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                                    <div>
                                                        <p className="font-semibold text-slate-800">
                                                            {
                                                                log.activity
                                                            }
                                                        </p>

                                                        <p className="mt-1 text-sm text-slate-600">
                                                            {
                                                                log.description
                                                            }
                                                        </p>

                                                        <p className="mt-2 text-xs text-slate-400">
                                                            IP:{" "}
                                                            {log.ip_address ??
                                                                "-"}
                                                        </p>
                                                    </div>

                                                    <span className="whitespace-nowrap text-xs font-medium text-slate-500">
                                                        {formatDateTime(
                                                            log.created_at
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        )
                                    )
                                ) : (
                                    <div className="px-6 py-12 text-center text-sm text-slate-400">
                                        Belum ada riwayat
                                        aktivitas.
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>
                </div>

                {/* Footer */}

                <div className="flex flex-wrap items-center justify-end gap-2 border-t border-slate-200 bg-white px-7 py-4">
                    {canEditUser(currentUser, user) &&
                        onEdit && (
                            <FooterButton
                                onClick={() =>
                                    onEdit(user)
                                }
                                disabled={isLoading(
                                    actionLoading,
                                    "edit",
                                    user
                                )}
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                <Edit size={16} />
                                Edit
                            </FooterButton>
                        )}

                    {canResetPassword(
                        currentUser,
                        user
                    ) &&
                        onResetPassword && (
                            <FooterButton
                                onClick={() =>
                                    onResetPassword(
                                        user
                                    )
                                }
                                disabled={isLoading(
                                    actionLoading,
                                    "reset",
                                    user
                                )}
                                className="bg-indigo-600 hover:bg-indigo-700"
                            >
                                <KeyRound size={16} />
                                Reset Password
                            </FooterButton>
                        )}

                    {canApproveUser(
                        currentUser,
                        user
                    ) &&
                        onApprove && (
                            <FooterButton
                                onClick={() =>
                                    onApprove(user)
                                }
                                disabled={isLoading(
                                    actionLoading,
                                    "approve",
                                    user
                                )}
                                className="bg-emerald-600 hover:bg-emerald-700"
                            >
                                <Send size={16} />
                                Approve & Kirim OTP
                            </FooterButton>
                        )}

                    {canRejectUser(
                        currentUser,
                        user
                    ) &&
                        onReject && (
                            <FooterButton
                                onClick={() =>
                                    onReject(user)
                                }
                                disabled={isLoading(
                                    actionLoading,
                                    "reject",
                                    user
                                )}
                                className="bg-orange-600 hover:bg-orange-700"
                            >
                                <XCircle size={16} />
                                Tolak
                            </FooterButton>
                        )}

                    {(
                        (canDisableUser(
                            currentUser,
                            user
                        ) &&
                            onDisable) ||
                        (canEnableUser(
                            currentUser,
                            user
                        ) &&
                            onEnable)
                    ) && (
                        <FooterButton
                            onClick={() =>
                                isDisabled
                                    ? onEnable(user)
                                    : onDisable(user)
                            }
                            disabled={
                                isLoading(
                                    actionLoading,
                                    "disable",
                                    user
                                ) ||
                                isLoading(
                                    actionLoading,
                                    "enable",
                                    user
                                )
                            }
                            className={
                                isDisabled
                                    ? "bg-emerald-600 hover:bg-emerald-700"
                                    : "bg-red-600 hover:bg-red-700"
                            }
                        >
                            {isDisabled ? (
                                <CheckCircle2
                                    size={16}
                                />
                            ) : (
                                <Ban size={16} />
                            )}

                            {isDisabled
                                ? "Aktifkan"
                                : "Nonaktifkan"}
                        </FooterButton>
                    )}

                    {canDeleteUser(
                        currentUser,
                        user
                    ) &&
                        onDelete && (
                            <FooterButton
                                onClick={() =>
                                    onDelete(user)
                                }
                                disabled={isLoading(
                                    actionLoading,
                                    "delete",
                                    user
                                )}
                                className="bg-red-700 hover:bg-red-800"
                            >
                                <Trash2 size={16} />
                                Hapus
                            </FooterButton>
                        )}

                    <button
                        type="button"
                        onClick={onClose}
                        className="cursor-pointer rounded-xl border border-slate-200 bg-white px-5 py-2.5 font-semibold text-slate-700 transition hover:bg-slate-100"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
}

function SectionTitle({
    icon,
    title
}) {
    return (
        <div className="flex items-center gap-2 text-slate-800">
            <span className="text-blue-600">
                {icon}
            </span>

            <h3 className="font-semibold">
                {title}
            </h3>
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
            <div className="flex items-center gap-2 text-sm text-slate-500">
                {icon}
                <span>{label}</span>
            </div>

            <p className="mt-2 break-words font-semibold text-slate-800">
                {value || "-"}
            </p>
        </div>
    );
}

function StatusItem({
    icon,
    label,
    children
}) {
    return (
        <div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
                {icon}
                <span>{label}</span>
            </div>

            <div className="mt-2">
                {children}
            </div>
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
                rounded-xl
                px-4
                py-2.5
                text-sm
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

function initialName(name) {
    return name
        ? name
              .trim()
              .charAt(0)
              .toUpperCase()
        : "U";
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

function statusColor(status) {
    if (status === "aktif") return "green";
    if (status === "disabled") return "red";

    return "yellow";
}

function statusLabel(status) {
    if (status === "aktif") return "Aktif";
    if (status === "disabled") return "Nonaktif";
    if (status === "pending") return "Pending";

    return status ?? "-";
}

function approvalColor(approval) {
    if (approval === "approved") return "green";
    if (approval === "pending") return "yellow";

    return "red";
}

function approvalLabel(approval) {
    if (approval === "approved") {
        return "Disetujui";
    }

    if (approval === "rejected") {
        return "Ditolak";
    }

    if (approval === "pending") {
        return "Pending";
    }

    return approval ?? "-";
}

function formatDateTime(value) {
    return value
        ? new Date(value).toLocaleString(
              "id-ID",
              {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit"
              }
          )
        : "-";
}

function isLoading(
    actionLoading,
    action,
    user
) {
    return (
        actionLoading === user.id ||
        actionLoading ===
            `${action}-${user.id}`
    );
}
