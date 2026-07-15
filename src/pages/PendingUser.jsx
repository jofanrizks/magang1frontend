import { useEffect, useState } from "react";
import Swal from "sweetalert2";

import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Table from "../components/ui/Table";
import RejectUserModal from "../components/dashboard/RejectUserModal";
import UserDetailModal from "../components/dashboard/UserDetailModal";
import {
    getPendingUsers,
    getUserDetail,
    getUserLogs,
    rejectUser as rejectUserApi,
    sendUserOtp
} from "../services/userService";
import { me } from "../services/authService";
import {
    canApproveUser,
    canRejectUser
} from "../utils/userPermissions";

export default function PendingUser() {
    const [users, setUsers]                 = useState([]);
    const [currentUser, setCurrentUser]     = useState(null);
    const [selectedUser, setSelectedUser]   = useState(null);
    const [rejectTarget, setRejectTarget]   = useState(null);
    const [actionLoading, setActionLoading] = useState(null);
    const [submitting, setSubmitting]       = useState(false);
    const [rejectErrors, setRejectErrors]   = useState({});

    useEffect(() => {
        getUsers();
        getCurrentUser();
    }, []);

    async function getCurrentUser() {
        try {
            const response = await me();
            const payload = response.data.data ?? response.data.user;

            setCurrentUser(payload);

            if (payload) {
                localStorage.setItem("user", JSON.stringify(payload));
            }
        } catch (err) {
            showRequestError(err, "Gagal mengambil data user aktif.");
        }
    }

    async function getUsers() {
        try {
            const res = await getPendingUsers();
            const payload = res.data.data;

            setUsers(payload?.data ?? payload ?? []);
        } catch (err) {
            showRequestError(err, "Gagal mengambil pending user.");
        }
    }

    async function openUser(user) {
        try {
            setActionLoading(`detail-${user.id}`);

            const [detailResponse, logResponse] = await Promise.all([
                getUserDetail(user.id),
                getUserLogs(user.id)
            ]);

            const detail = detailResponse.data.data;
            const logUser = logResponse.data.data;

            setSelectedUser({
                ...detail,
                activity_logs: logUser.activity_logs ?? detail.activity_logs ?? []
            });
        } catch (err) {
            showRequestError(err, "Gagal mengambil detail pengguna.");
        } finally {
            setActionLoading(null);
        }
    }

    async function refreshSelectedUser(userId = selectedUser?.id) {
        if (!userId) return;

        await openUser({ id: userId });
    }

    async function approveUser(user) {
        const result = await Swal.fire({
            title: `Setujui ${user.nama}?`,
            text: "User akan disetujui dan OTP aktivasi dikirim ke WhatsApp.",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Setujui & Kirim OTP",
            cancelButtonText: "Batal",
            confirmButtonColor: "#059669"
        });

        if (!result.isConfirmed) return;

        try {
            setActionLoading(`approve-${user.id}`);

            await sendUserOtp(user.id);
            await getUsers();
            await refreshSelectedUser(user.id);

            await Swal.fire("Berhasil", "User disetujui dan OTP berhasil dikirim.", "success");
        } catch (err) {
            showRequestError(err, "OTP gagal dikirim.");
        } finally {
            setActionLoading(null);
        }
    }

    function openRejectModal(user) {
        setRejectErrors({});
        setRejectTarget(user);
    }

    function closeRejectModal() {
        if (submitting) return;

        setRejectTarget(null);
        setRejectErrors({});
    }

    async function submitReject(payload) {
        try {
            setSubmitting(true);
            setRejectErrors({});

            await rejectUserApi(rejectTarget.id, payload);
            await getUsers();
            await refreshSelectedUser(rejectTarget.id);

            setRejectTarget(null);
            setRejectErrors({});

            await Swal.fire(
                "Berhasil",
                "Pengguna berhasil ditolak. Alasan penolakan akan dikirim melalui WhatsApp.",
                "success"
            );
        } catch (err) {
            setRejectErrors(err.response?.data?.errors ?? {});
            showRequestError(err, "Pengguna gagal ditolak.");
        } finally {
            setSubmitting(false);
        }
    }

    const columns = [
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
            key: "tgldaftar",
            title: "Tanggal Daftar",
            align: "center",
            render: (user) =>
                user.tgldaftar
                    ? new Date(user.tgldaftar).toLocaleDateString("id-ID")
                    : "-"
        },
        {
            key: "approval",
            title: "Approval",
            align: "center",
            render: () => (
                <Badge color="yellow">
                    pending
                </Badge>
            )
        },
        {
            key: "action",
            title: "Aksi",
            align: "center",
            sortable: false,
            render: (user) => (
                <div className="flex flex-wrap justify-center gap-2">
                    <Button
                        onClick={() => openUser(user)}
                        className="w-auto rounded-lg bg-slate-600 px-4 py-2 text-sm hover:bg-slate-700"
                    >
                        Detail
                    </Button>

                    {canApproveUser(currentUser, user) && (
                        <Button
                            onClick={() => approveUser(user)}
                            disabled={actionLoading === `approve-${user.id}`}
                            className="w-auto rounded-lg bg-green-600 px-4 py-2 text-sm hover:bg-green-700 disabled:opacity-60"
                        >
                            {actionLoading === `approve-${user.id}` ? "Loading..." : "Approve"}
                        </Button>
                    )}

                    {canRejectUser(currentUser, user) && (
                        <Button
                            onClick={() => openRejectModal(user)}
                            disabled={submitting}
                            className="w-auto rounded-lg bg-red-600 px-4 py-2 text-sm hover:bg-red-700 disabled:opacity-60"
                        >
                            Reject
                        </Button>
                    )}
                </div>
            )
        }
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">
                    Pending User
                </h1>

                <p className="mt-2 text-gray-500">
                    Daftar pengguna yang menunggu persetujuan admin
                </p>
            </div>

            <Table
                columns={columns}
                data={users}
                search
                searchPlaceHolder="Cari pending user"
            />

            <UserDetailModal
                user={selectedUser}
                currentUser={currentUser}
                onClose={() => setSelectedUser(null)}
                onApprove={approveUser}
                onReject={openRejectModal}
                actionLoading={actionLoading}
            />

            <RejectUserModal
                open={Boolean(rejectTarget)}
                user={rejectTarget}
                loading={submitting}
                errors={rejectErrors}
                onClose={closeRejectModal}
                onSubmit={submitReject}
            />
        </div>
    );
}

function requestMessage(err, fallback) {
    if (err.response?.status === 403) {
        return err.response?.data?.message ?? "Akses ditolak.";
    }

    if (err.response?.status === 404) {
        return err.response?.data?.message ?? "User tidak ditemukan.";
    }

    if (err.response?.status === 422) {
        return err.response?.data?.message ?? "Data tidak valid.";
    }

    if (err.response?.status >= 500) {
        return "Terjadi kesalahan server.";
    }

    return err.response?.data?.message ?? fallback;
}

function showRequestError(err, fallback) {
    Swal.fire("Gagal", requestMessage(err, fallback), "error");
}