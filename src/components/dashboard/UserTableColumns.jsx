import { useEffect, useRef, useState } from "react";
import Badge from "../ui/Badge";
import {
    Ban,
    CheckCircle2,
    Edit,
    Eye,
    KeyRound,
    MoreVertical,
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
import { formatUserGroups } from "../../utils/groups";

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
            title: "Pengguna",
            align: "left",
            render: (user) => (
                <div className="min-w-52">
                    <p className="font-semibold text-slate-800">
                        {user.nama ?? "-"}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                        {user.instansi ?? "-"}
                        {user.jabatan
                            ? ` • ${user.jabatan}`
                            : ""}
                    </p>
                </div>
            )
        },

        {
            key: "nik",
            title: "NIK",
            align: "left",
            render: (user) => (
                <span className="whitespace-nowrap text-sm text-slate-700">
                    {user.nik ?? "-"}
                </span>
            )
        },

        {
            key: "role",
            title: "Role",
            align: "center",
            render: (user) => (
                <RoleBadge role={user.role} />
            )
        },

        {
            key: "telp",
            title: "Kontak",
            align: "left",
            render: (user) => (
                <div className="min-w-36">
                    <p className="whitespace-nowrap text-sm font-medium text-slate-700">
                        {user.telp ?? "-"}
                    </p>

                    {user.role === "user" && (
                        <p className="mt-1 text-xs text-slate-500">
                            {formatUserGroups(user)}
                        </p>
                    )}
                </div>
            )
        },

        {
            key: "sts",
            title: "Status",
            align: "center",
            render: (user) => (
                <Badge color={statusColor(user.sts)}>
                    {statusLabel(user.sts)}
                </Badge>
            )
        },

        {
            key: "approval",
            title: "Approval",
            align: "center",
            render: (user) => (
                <Badge color={approvalColor(user.approval)}>
                    {approvalLabel(user.approval)}
                </Badge>
            )
        },

        {
            key: "tgldaftar",
            title: "Terdaftar",
            align: "center",
            render: (user) => (
                <span className="whitespace-nowrap text-sm text-slate-600">
                    {formatDate(user.tgldaftar)}
                </span>
            )
        },

        {
            key: "action",
            title: "Aksi",
            align: "center",
            sortable: false,
            render: (user) => (
                <UserActionMenu
                    user={user}
                    currentUser={currentUser}
                    onDetail={onDetail}
                    onEdit={onEdit}
                    onResetPassword={onResetPassword}
                    onApprove={onApprove}
                    onReject={onReject}
                    onDisable={onDisable}
                    onEnable={onEnable}
                    onDelete={onDelete}
                    actionLoading={actionLoading}
                />
            )
        }
    ];
}

function UserActionMenu({
    user,
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
    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);

    const isDisabled =
        user.sts === "disabled";

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target)
            ) {
                setOpen(false);
            }
        }

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, []);

    function runAction(callback) {
        setOpen(false);

        if (callback) {
            callback(user);
        }
    }

    return (
        <div className="flex items-center justify-center gap-2">
            <button
                type="button"
                onClick={() => onDetail(user)}
                title="Lihat detail"
                className="
                    inline-flex
                    h-9
                    w-9
                    cursor-pointer
                    items-center
                    justify-center
                    rounded-lg
                    bg-slate-100
                    text-slate-700
                    transition
                    hover:bg-slate-200
                "
            >
                <Eye size={17} />
            </button>

            <div
                ref={menuRef}
                className="relative"
            >
                <button
                    type="button"
                    onClick={() =>
                        setOpen((previous) => !previous)
                    }
                    title="Tindakan lainnya"
                    className={`
                        inline-flex
                        h-9
                        w-9
                        cursor-pointer
                        items-center
                        justify-center
                        rounded-lg
                        transition
                        ${
                            open
                                ? "bg-blue-600 text-white"
                                : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                        }
                    `}
                >
                    <MoreVertical size={18} />
                </button>

                {open && (
                    <div
                        className="
                            absolute
                            right-0
                            top-11
                            z-50
                            min-w-52
                            overflow-hidden
                            rounded-xl
                            border
                            border-slate-200
                            bg-white
                            py-2
                            text-left
                            shadow-xl
                        "
                    >
                        {canEditUser(currentUser, user) && onEdit && (
                            <MenuItem
                                icon={<Edit size={17} />}
                                label="Edit pengguna"
                                onClick={() =>
                                    runAction(onEdit)
                                }
                                disabled={isLoading(
                                    actionLoading,
                                    "edit",
                                    user
                                )}
                                className="text-blue-700"
                            />
                        )}

                        {canResetPassword(currentUser, user) &&
                            onResetPassword && (
                                <MenuItem
                                    icon={<KeyRound size={17} />}
                                    label="Reset password"
                                    onClick={() =>
                                        runAction(onResetPassword)
                                    }
                                    disabled={isLoading(
                                        actionLoading,
                                        "reset",
                                        user
                                    )}
                                    className="text-indigo-700"
                                />
                            )}

                        {canApproveUser(currentUser, user) &&
                            onApprove && (
                                <MenuItem
                                    icon={<Send size={17} />}
                                    label="Approve & kirim OTP"
                                    onClick={() =>
                                        runAction(onApprove)
                                    }
                                    disabled={isLoading(
                                        actionLoading,
                                        "approve",
                                        user
                                    )}
                                    className="text-emerald-700"
                                />
                            )}

                        {canRejectUser(currentUser, user) &&
                            onReject && (
                                <MenuItem
                                    icon={<XCircle size={17} />}
                                    label="Tolak pengguna"
                                    onClick={() =>
                                        runAction(onReject)
                                    }
                                    disabled={isLoading(
                                        actionLoading,
                                        "reject",
                                        user
                                    )}
                                    className="text-orange-700"
                                />
                            )}

                        {(
                            (canDisableUser(currentUser, user) &&
                                onDisable) ||
                            (canEnableUser(currentUser, user) &&
                                onEnable)
                        ) && (
                            <MenuItem
                                icon={
                                    isDisabled ? (
                                        <CheckCircle2 size={17} />
                                    ) : (
                                        <Ban size={17} />
                                    )
                                }
                                label={
                                    isDisabled
                                        ? "Aktifkan pengguna"
                                        : "Nonaktifkan pengguna"
                                }
                                onClick={() =>
                                    runAction(
                                        isDisabled
                                            ? onEnable
                                            : onDisable
                                    )
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
                                        ? "text-emerald-700"
                                        : "text-red-700"
                                }
                            />
                        )}

                        {canDeleteUser(currentUser, user) &&
                            onDelete && (
                                <>
                                    <div className="my-2 border-t border-slate-100" />

                                    <MenuItem
                                        icon={<Trash2 size={17} />}
                                        label="Hapus pengguna"
                                        onClick={() =>
                                            runAction(onDelete)
                                        }
                                        disabled={isLoading(
                                            actionLoading,
                                            "delete",
                                            user
                                        )}
                                        className="text-red-700"
                                    />
                                </>
                            )}
                    </div>
                )}
            </div>
        </div>
    );
}

function MenuItem({
    icon,
    label,
    className = "",
    ...props
}) {
    return (
        <button
            type="button"
            className={`
                flex
                w-full
                cursor-pointer
                items-center
                gap-3
                px-4
                py-2.5
                text-sm
                font-medium
                transition
                hover:bg-slate-50
                disabled:cursor-not-allowed
                disabled:opacity-50
                ${className}
            `}
            {...props}
        >
            {icon}

            <span>{label}</span>
        </button>
    );
}

function RoleBadge({ role }) {
    const roleConfig = {
        super_admin: {
            label: "Super Admin",
            className:
                "bg-purple-100 text-purple-700"
        },
        admin: {
            label: "Admin",
            className:
                "bg-blue-100 text-blue-700"
        },
        user: {
            label: "User",
            className:
                "bg-slate-100 text-slate-700"
        },
        viewer: {
            label: "Viewer",
            className:
                "bg-cyan-100 text-cyan-700"
        }
    };

    const config =
        roleConfig[role] ?? {
            label: role ?? "-",
            className:
                "bg-slate-100 text-slate-700"
        };

    return (
        <span
            className={`
                inline-flex
                whitespace-nowrap
                rounded-full
                px-3
                py-1
                text-xs
                font-semibold
                ${config.className}
            `}
        >
            {config.label}
        </span>
    );
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
    if (approval === "rejected") return "red";

    return "yellow";
}

function approvalLabel(approval) {
    if (approval === "approved") return "Disetujui";
    if (approval === "rejected") return "Ditolak";
    if (approval === "pending") return "Pending";

    return approval ?? "-";
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

function formatDate(value) {
    return value
        ? new Date(value).toLocaleDateString(
              "id-ID",
              {
                  day: "2-digit",
                  month: "short",
                  year: "numeric"
              }
          )
        : "-";
}
