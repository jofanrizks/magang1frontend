import Badge from "../ui/Badge";
import {
    Ban,
    CheckCircle2,
    Edit,
    Eye,
    KeyRound,
    Send,
    Trash2,
    XCircle
} from "lucide-react";
import {
    canApproveUser,
    canDeleteUser,
    canDisableUser,
    canEditUser,
    canEnableUser,
    canRejectUser,
    canResetPassword
} from "../../utils/userPermissions";

export default function userTableColumns({
    currentUser,
    onDetail,
    onEdit,
    onResetPassword,
    onApprove,
    onReject,
    onDisable,
    onEnable,
    onDelete,
    actionLoading
}) {

    return [

        {
            key: "nama",
            title: "Nama",
            align: "center"
        },

        {
            key: "nik",
            title: "NIK",
            align: "center"
        },

        {
            key: "role",
            title: "Role",
            align: "center"
        },

        {
            key: "instansi",
            title: "Instansi",
            align: "center"
        },

        {
            key: "jabatan",
            title: "Jabatan",
            align: "center"
        },

        {
            key: "telp",
            title: "No HP",
            align: "center"
        },

        {
            key: "group",
            title: "Group",
            align: "center",
            sortable: false,
            render: (user) =>
                user.role === "user"
                    ? user.group?.name ?? "-"
                    : "-"
        },

        {
            key: "sts",
            title: "Status",
            align: "center",

            render: (user) => (

                <Badge
                    color={
                        user.sts === "aktif"
                            ? "green"
                            : user.sts === "disabled"
                            ? "red"
                            : "yellow"
                    }
                >

                    {user.sts}

                </Badge>

            )

        },

        {
            key: "approval",
            title: "Approval",
            align: "center",

            render: (user) => (

                <Badge
                    color={
                        user.approval === "approved"
                            ? "green"
                            : user.approval === "rejected"
                            ? "red"
                            : "yellow"
                    }
                >

                    {user.approval}

                </Badge>

            )

        },

        {
            key: "rejection_reason",
            title: "Alasan Penolakan",
            align: "center",
            render: (user) => user.rejection_reason ?? "-"
        },

        {
            key: "login_attempt",
            title: "Login Attempt",
            align: "center",
            render: (user) => user.login_attempt ?? 0
        },

        {
            key: "tgldaftar",
            title: "Tgl Daftar",
            align: "center",

            render: (user) =>
                formatDate(user.tgldaftar)
        },

        {
            key: "tglapproval",
            title: "Tgl Approval",
            align: "center",

            render: (user) =>
                formatDate(user.tglapproval)
        },

        {
            key: "tgldisabled",
            title: "Tgl Disabled",
            align: "center",

            render: (user) =>
                formatDate(user.tgldisabled)
        },

        {
            key: "detail",
            title: "Aksi",
            align: "center",
            sortable: false,

            render: (user) => {
                const isDisabled =
                    user.sts === "disabled";

                return (
                    <div className="flex flex-wrap items-center justify-center gap-2">
                        <ActionButton
                            onClick={() => onDetail(user)}
                            title="Detail"
                            className="bg-slate-100 hover:bg-slate-200"
                        >

                            <Eye size={18} />

                        </ActionButton>

                        {canEditUser(currentUser, user) && onEdit && (
                            <ActionButton
                                onClick={() => onEdit(user)}
                                title="Edit"
                                className="bg-blue-100 text-blue-700 hover:bg-blue-200"
                                disabled={isLoading(actionLoading, "edit", user)}
                            >
                                <Edit size={18} />
                            </ActionButton>
                        )}

                        {canResetPassword(currentUser, user) && onResetPassword && (
                            <ActionButton
                                onClick={() => onResetPassword(user)}
                                title="Reset Password"
                                className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                                disabled={isLoading(actionLoading, "reset", user)}
                            >
                                <KeyRound size={18} />
                            </ActionButton>
                        )}

                        {canApproveUser(currentUser, user) && onApprove && (
                            <ActionButton
                                onClick={() => onApprove(user)}
                                title="Approve / Kirim OTP"
                                className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                                disabled={isLoading(actionLoading, "approve", user)}
                            >
                                <Send size={18} />
                            </ActionButton>
                        )}

                        {canRejectUser(currentUser, user) && onReject && (
                            <ActionButton
                                onClick={() => onReject(user)}
                                title="Reject"
                                className="bg-orange-100 text-orange-700 hover:bg-orange-200"
                                disabled={isLoading(actionLoading, "reject", user)}
                            >
                                <XCircle size={18} />
                            </ActionButton>
                        )}

                        {((canDisableUser(currentUser, user) && onDisable) ||
                            (canEnableUser(currentUser, user) && onEnable)) && (
                            <ActionButton
                                onClick={() =>
                                    isDisabled
                                        ? onEnable(user)
                                        : onDisable(user)
                                }
                                disabled={
                                    isLoading(actionLoading, "disable", user) ||
                                    isLoading(actionLoading, "enable", user)
                                }
                                className={`
                                    ${
                                        isDisabled
                                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                                            : "bg-red-100 text-red-700 hover:bg-red-200"
                                    }
                                `}
                                title={
                                    isDisabled
                                        ? "Aktifkan"
                                        : "Nonaktifkan"
                                }
                            >

                                {isDisabled ? (
                                    <CheckCircle2 size={18} />
                                ) : (
                                    <Ban size={18} />
                                )}

                            </ActionButton>
                        )}

                        {canDeleteUser(currentUser, user) && onDelete && (
                            <ActionButton
                                onClick={() => onDelete(user)}
                                title="Delete"
                                className="bg-red-100 text-red-700 hover:bg-red-200"
                                disabled={isLoading(actionLoading, "delete", user)}
                            >
                                <Trash2 size={18} />
                            </ActionButton>
                        )}
                    </div>
                );
            }

        }

    ];

}

function ActionButton({
    children,
    className = "",
    ...props
}) {
    return (
        <button
            type="button"
            className={`
                inline-flex
                h-9
                w-9
                cursor-pointer
                items-center
                justify-center
                rounded-lg
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

function isLoading(actionLoading, action, user) {
    return actionLoading === user.id ||
        actionLoading === `${action}-${user.id}`;
}

function formatDate(value) {
    return value
        ? new Date(value).toLocaleDateString("id-ID")
        : "-";
}
