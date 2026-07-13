import { useEffect, useState } from "react";
import Swal from "sweetalert2";

import {
    createUser,
    deleteUser,
    disableUser,
    enableUser,
    getAllUsers,
    getGroups,
    getUserDetail,
    getUserLogs,
    rejectUser,
    resetPassword,
    sendUserOtp,
    updateUser
} from "../services/userService";
import { me } from "../services/authService";

import Button from "../components/ui/Button";
import Table from "../components/ui/Table";
import DashboardStats from "../components/dashboard/DashboardStats";
import RejectUserModal from "../components/dashboard/RejectUserModal";
import ResetPasswordModal from "../components/dashboard/ResetPasswordModal";
import UserDetailModal from "../components/dashboard/UserDetailModal";
import UserFormModal from "../components/dashboard/UserFormModal";
import dashboardStats from "../utils/dashboardStats";
import userTableColumns from "../components/dashboard/UserTableColumns";
import { canCreateUsers } from "../utils/userPermissions";

export default function Dashboard() {
    const [users, setUsers] = useState([]);
    const [groups, setGroups] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [listLoading, setListLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(null);
    const [formModal, setFormModal] = useState({
        open: false,
        mode: "create",
        user: null
    });
    const [resetTarget, setResetTarget] = useState(null);
    const [rejectTarget, setRejectTarget] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [resetErrors, setResetErrors] = useState({});
    const [rejectErrors, setRejectErrors] = useState({});

    useEffect(() => {
        fetchUsers();
        fetchCurrentUser();
        fetchGroups();
    }, []);

    async function fetchCurrentUser() {
        try {
            const res = await me();
            const payload = res.data.data ?? res.data.user;

            setCurrentUser(payload);

            if (payload) {
                localStorage.setItem("user", JSON.stringify(payload));
            }
        } catch (err) {
            showRequestError(err, "Gagal mengambil data user aktif.");
        }
    }

    async function fetchUsers() {
        try {
            setListLoading(true);

            const res = await getAllUsers();
            const payload = res.data.data;

            setUsers(payload?.data ?? payload ?? []);
        } catch (err) {
            showRequestError(err, "Gagal mengambil data pengguna.");
        } finally {
            setListLoading(false);
        }
    }

    async function fetchGroups() {
        try {
            const res = await getGroups();
            setGroups(res.data.data ?? []);
        } catch (err) {
            showRequestError(err, "Gagal mengambil data group.");
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

    function closeUser() {
        setSelectedUser(null);
    }

    function openCreateModal() {
        setFormErrors({});
        setFormModal({
            open: true,
            mode: "create",
            user: null
        });
    }

    function openEditModal(user) {
        setFormErrors({});
        setFormModal({
            open: true,
            mode: "edit",
            user
        });
    }

    function closeFormModal() {
        if (submitting) return;

        setFormModal({
            open: false,
            mode: "create",
            user: null
        });
        setFormErrors({});
    }

    async function submitUserForm(payload) {
        try {
            setSubmitting(true);
            setFormErrors({});

            if (formModal.mode === "edit") {
                await updateUser(formModal.user.id, payload);
                await fetchUsers();
                await refreshSelectedUser(formModal.user.id);
                await Swal.fire("Berhasil", "Pengguna berhasil diperbarui.", "success");
            } else {
                await createUser(payload);
                await fetchUsers();
                await Swal.fire("Berhasil", "Pengguna berhasil dibuat.", "success");
            }

            setFormModal({
                open: false,
                mode: "create",
                user: null
            });
            setFormErrors({});
        } catch (err) {
            setFormErrors(validationErrors(err));
            showRequestError(err, "Pengguna gagal disimpan.");
        } finally {
            setSubmitting(false);
        }
    }

    function openResetModal(user) {
        setResetErrors({});
        setResetTarget(user);
    }

    function closeResetModal() {
        if (submitting) return;

        setResetTarget(null);
        setResetErrors({});
    }

    async function submitResetPassword(payload) {
        try {
            setSubmitting(true);
            setResetErrors({});

            await resetPassword(resetTarget.id, payload);
            await refreshSelectedUser(resetTarget.id);

            setResetTarget(null);
            setResetErrors({});

            await Swal.fire(
                "Berhasil",
                "Password berhasil di-reset. Pengguna wajib mengganti password saat login berikutnya.",
                "success"
            );
        } catch (err) {
            setResetErrors(validationErrors(err));
            showRequestError(err, "Password gagal di-reset.");
        } finally {
            setSubmitting(false);
        }
    }

    async function handleApprove(user) {
        const result = await Swal.fire({
            title: `Kirim OTP ke ${user.nama}?`,
            text: "Endpoint approval yang tersedia adalah kirim OTP aktivasi.",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Kirim OTP",
            cancelButtonText: "Batal",
            confirmButtonColor: "#059669"
        });

        if (!result.isConfirmed) return;

        try {
            setActionLoading(`approve-${user.id}`);

            await sendUserOtp(user.id);
            await fetchUsers();
            await refreshSelectedUser(user.id);

            await Swal.fire("Berhasil", "OTP berhasil dikirim.", "success");
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

            await rejectUser(rejectTarget.id, payload);
            await fetchUsers();
            await refreshSelectedUser(rejectTarget.id);

            setRejectTarget(null);
            setRejectErrors({});

            await Swal.fire(
                "Berhasil",
                "Pengguna berhasil ditolak. Alasan penolakan akan dikirim melalui WhatsApp.",
                "success"
            );
        } catch (err) {
            setRejectErrors(validationErrors(err));
            showRequestError(err, "Pengguna gagal ditolak.");
        } finally {
            setSubmitting(false);
        }
    }

    async function handleDisable(user) {
        const result = await Swal.fire({
            title: `Nonaktifkan akun ${user.nama}?`,
            text: "Akun akan dinonaktifkan dan notifikasi dikirim melalui WhatsApp.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Nonaktifkan",
            cancelButtonText: "Batal",
            confirmButtonColor: "#dc2626"
        });

        if (!result.isConfirmed) return;

        try {
            setActionLoading(`disable-${user.id}`);

            const response = await disableUser(user.id);

            await fetchUsers();
            await refreshSelectedUser(user.id);

            await Swal.fire(
                "Berhasil",
                response.data?.warning ?? "Akun berhasil dinonaktifkan.",
                response.data?.warning ? "warning" : "success"
            );
        } catch (err) {
            showRequestError(err, "Akun gagal dinonaktifkan.");
        } finally {
            setActionLoading(null);
        }
    }

    async function handleEnable(user) {
        const result = await Swal.fire({
            title: `Aktifkan akun ${user.nama}?`,
            text: "Akun pengguna akan diaktifkan kembali oleh admin.",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Aktifkan",
            cancelButtonText: "Batal",
            confirmButtonColor: "#16a34a"
        });

        if (!result.isConfirmed) return;

        try {
            setActionLoading(`enable-${user.id}`);

            await enableUser(user.id);
            await fetchUsers();
            await refreshSelectedUser(user.id);

            await Swal.fire("Berhasil", "Akun berhasil diaktifkan.", "success");
        } catch (err) {
            showRequestError(err, "Akun gagal diaktifkan.");
        } finally {
            setActionLoading(null);
        }
    }

    async function handleDelete(user) {
        const result = await Swal.fire({
            title: `Hapus akun ${user.nama}?`,
            text: "Tindakan ini permanen dan tidak dapat dibatalkan.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Hapus",
            cancelButtonText: "Batal",
            confirmButtonColor: "#b91c1c"
        });

        if (!result.isConfirmed) return;

        try {
            setActionLoading(`delete-${user.id}`);

            await deleteUser(user.id);

            if (selectedUser?.id === user.id) {
                closeUser();
            }

            await fetchUsers();

            await Swal.fire("Berhasil", "Pengguna berhasil dihapus.", "success");
        } catch (err) {
            showRequestError(err, "Pengguna gagal dihapus.");
        } finally {
            setActionLoading(null);
        }
    }

    const stats = dashboardStats(users);

    const columns = userTableColumns({
        currentUser,
        onDetail: openUser,
        onEdit: openEditModal,
        onResetPassword: openResetModal,
        onApprove: handleApprove,
        onReject: openRejectModal,
        onDisable: handleDisable,
        onEnable: handleEnable,
        onDelete: handleDelete,
        actionLoading
    });

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold">
                        Dashboard Admin
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Monitoring dan pengelolaan seluruh pengguna sistem.
                    </p>
                </div>

                {canCreateUsers(currentUser) && (
                    <Button
                        onClick={openCreateModal}
                        className="w-auto rounded-lg px-5 py-2"
                    >
                        Tambah Pengguna
                    </Button>
                )}
            </div>

            <DashboardStats stats={stats} />

            <Table
                title="Data User"
                subtitle={listLoading ? "Memuat data pengguna..." : "Seluruh data pengguna yang terdaftar"}
                columns={columns}
                data={users}
                search
                searchPlaceHolder="Cari User"
            />

            <UserDetailModal
                user={selectedUser}
                currentUser={currentUser}
                onClose={closeUser}
                onEdit={openEditModal}
                onResetPassword={openResetModal}
                onApprove={handleApprove}
                onReject={openRejectModal}
                onDisable={handleDisable}
                onEnable={handleEnable}
                onDelete={handleDelete}
                actionLoading={actionLoading}
            />

            <UserFormModal
                open={formModal.open}
                mode={formModal.mode}
                user={formModal.user}
                currentUser={currentUser}
                groups={groups}
                loading={submitting}
                errors={formErrors}
                onClose={closeFormModal}
                onSubmit={submitUserForm}
            />

            <ResetPasswordModal
                open={Boolean(resetTarget)}
                user={resetTarget}
                loading={submitting}
                errors={resetErrors}
                onClose={closeResetModal}
                onSubmit={submitResetPassword}
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

function validationErrors(err) {
    return err.response?.data?.errors ?? {};
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
