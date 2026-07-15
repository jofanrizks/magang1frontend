import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
    Plus,
    Users
} from "lucide-react";

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
    const [selectedUser, setSelectedUser] =
        useState(null);

    const [currentUser, setCurrentUser] =
        useState(null);

    const [listLoading, setListLoading] =
        useState(false);

    const [actionLoading, setActionLoading] =
        useState(null);

    const [formModal, setFormModal] = useState({
        open: false,
        mode: "create",
        user: null
    });

    const [resetTarget, setResetTarget] =
        useState(null);

    const [rejectTarget, setRejectTarget] =
        useState(null);

    const [submitting, setSubmitting] =
        useState(false);

    const [formErrors, setFormErrors] =
        useState({});

    const [resetErrors, setResetErrors] =
        useState({});

    const [rejectErrors, setRejectErrors] =
        useState({});

    useEffect(() => {
        fetchUsers();
        fetchCurrentUser();
        fetchGroups();
    }, []);

    async function fetchCurrentUser() {
        try {
            const response = await me();

            const payload =
                response.data.data ??
                response.data.user;

            setCurrentUser(payload);

            if (payload) {
                localStorage.setItem(
                    "user",
                    JSON.stringify(payload)
                );
            }
        } catch (error) {
            showRequestError(
                error,
                "Gagal mengambil data user aktif."
            );
        }
    }

    async function fetchUsers() {
        try {
            setListLoading(true);

            const response =
                await getAllUsers();

            const payload =
                response.data.data;

            setUsers(
                payload?.data ??
                payload ??
                []
            );
        } catch (error) {
            showRequestError(
                error,
                "Gagal mengambil data pengguna."
            );
        } finally {
            setListLoading(false);
        }
    }

    async function fetchGroups() {
        try {
            const response =
                await getGroups();

            setGroups(
                response.data.data ?? []
            );
        } catch (error) {
            showRequestError(
                error,
                "Gagal mengambil data group."
            );
        }
    }

    async function openUser(user) {
        try {
            setActionLoading(
                `detail-${user.id}`
            );

            const [
                detailResponse,
                logResponse
            ] = await Promise.all([
                getUserDetail(user.id),
                getUserLogs(user.id)
            ]);

            const detail =
                detailResponse.data.data;

            const logUser =
                logResponse.data.data;

            setSelectedUser({
                ...detail,
                activity_logs:
                    logUser.activity_logs ??
                    detail.activity_logs ??
                    []
            });
        } catch (error) {
            showRequestError(
                error,
                "Gagal mengambil detail pengguna."
            );
        } finally {
            setActionLoading(null);
        }
    }

    async function refreshSelectedUser(
        userId = selectedUser?.id
    ) {
        if (!userId) {
            return;
        }

        await openUser({
            id: userId
        });
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
        if (submitting) {
            return;
        }

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
                await updateUser(
                    formModal.user.id,
                    payload
                );

                await fetchUsers();

                await refreshSelectedUser(
                    formModal.user.id
                );

                await Swal.fire(
                    "Berhasil",
                    "Pengguna berhasil diperbarui.",
                    "success"
                );
            } else {
                await createUser(payload);

                await fetchUsers();

                await Swal.fire(
                    "Berhasil",
                    "Pengguna berhasil dibuat.",
                    "success"
                );
            }

            setFormModal({
                open: false,
                mode: "create",
                user: null
            });

            setFormErrors({});
        } catch (error) {
            setFormErrors(
                validationErrors(error)
            );

            showRequestError(
                error,
                "Pengguna gagal disimpan."
            );
        } finally {
            setSubmitting(false);
        }
    }

    function openResetModal(user) {
        setResetErrors({});
        setResetTarget(user);
    }

    function closeResetModal() {
        if (submitting) {
            return;
        }

        setResetTarget(null);
        setResetErrors({});
    }

    async function submitResetPassword(
        payload
    ) {
        try {
            setSubmitting(true);
            setResetErrors({});

            await resetPassword(
                resetTarget.id,
                payload
            );

            await refreshSelectedUser(
                resetTarget.id
            );

            setResetTarget(null);
            setResetErrors({});

            await Swal.fire(
                "Berhasil",
                "Password berhasil di-reset. Pengguna wajib mengganti password saat login berikutnya.",
                "success"
            );
        } catch (error) {
            setResetErrors(
                validationErrors(error)
            );

            showRequestError(
                error,
                "Password gagal di-reset."
            );
        } finally {
            setSubmitting(false);
        }
    }

    async function handleApprove(user) {
        const result = await Swal.fire({
            title: `Kirim OTP ke ${user.nama}?`,
            text:
                "Endpoint approval yang tersedia adalah kirim OTP aktivasi.",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Kirim OTP",
            cancelButtonText: "Batal",
            confirmButtonColor: "#059669"
        });

        if (!result.isConfirmed) {
            return;
        }

        try {
            setActionLoading(
                `approve-${user.id}`
            );

            await sendUserOtp(user.id);
            await fetchUsers();
            await refreshSelectedUser(
                user.id
            );

            await Swal.fire(
                "Berhasil",
                "OTP berhasil dikirim.",
                "success"
            );
        } catch (error) {
            showRequestError(
                error,
                "OTP gagal dikirim."
            );
        } finally {
            setActionLoading(null);
        }
    }

    function openRejectModal(user) {
        setRejectErrors({});
        setRejectTarget(user);
    }

    function closeRejectModal() {
        if (submitting) {
            return;
        }

        setRejectTarget(null);
        setRejectErrors({});
    }

    async function submitReject(payload) {
        try {
            setSubmitting(true);
            setRejectErrors({});

            await rejectUser(
                rejectTarget.id,
                payload
            );

            await fetchUsers();

            await refreshSelectedUser(
                rejectTarget.id
            );

            setRejectTarget(null);
            setRejectErrors({});

            await Swal.fire(
                "Berhasil",
                "Pengguna berhasil ditolak. Alasan penolakan akan dikirim melalui WhatsApp.",
                "success"
            );
        } catch (error) {
            setRejectErrors(
                validationErrors(error)
            );

            showRequestError(
                error,
                "Pengguna gagal ditolak."
            );
        } finally {
            setSubmitting(false);
        }
    }

    async function handleDisable(user) {
        const result = await Swal.fire({
            title:
                `Nonaktifkan akun ${user.nama}?`,
            text:
                "Akun akan dinonaktifkan dan notifikasi dikirim melalui WhatsApp.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText:
                "Nonaktifkan",
            cancelButtonText: "Batal",
            confirmButtonColor: "#dc2626"
        });

        if (!result.isConfirmed) {
            return;
        }

        try {
            setActionLoading(
                `disable-${user.id}`
            );

            const response =
                await disableUser(user.id);

            await fetchUsers();

            await refreshSelectedUser(
                user.id
            );

            await Swal.fire(
                "Berhasil",
                response.data?.warning ??
                    "Akun berhasil dinonaktifkan.",
                response.data?.warning
                    ? "warning"
                    : "success"
            );
        } catch (error) {
            showRequestError(
                error,
                "Akun gagal dinonaktifkan."
            );
        } finally {
            setActionLoading(null);
        }
    }

    async function handleEnable(user) {
        const result = await Swal.fire({
            title:
                `Aktifkan akun ${user.nama}?`,
            text:
                "Akun pengguna akan diaktifkan kembali oleh admin.",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Aktifkan",
            cancelButtonText: "Batal",
            confirmButtonColor: "#16a34a"
        });

        if (!result.isConfirmed) {
            return;
        }

        try {
            setActionLoading(
                `enable-${user.id}`
            );

            await enableUser(user.id);
            await fetchUsers();

            await refreshSelectedUser(
                user.id
            );

            await Swal.fire(
                "Berhasil",
                "Akun berhasil diaktifkan.",
                "success"
            );
        } catch (error) {
            showRequestError(
                error,
                "Akun gagal diaktifkan."
            );
        } finally {
            setActionLoading(null);
        }
    }

    async function handleDelete(user) {
        const result = await Swal.fire({
            title:
                `Hapus akun ${user.nama}?`,
            text:
                "Tindakan ini permanen dan tidak dapat dibatalkan.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Hapus",
            cancelButtonText: "Batal",
            confirmButtonColor: "#b91c1c"
        });

        if (!result.isConfirmed) {
            return;
        }

        try {
            setActionLoading(
                `delete-${user.id}`
            );

            await deleteUser(user.id);

            if (
                selectedUser?.id === user.id
            ) {
                closeUser();
            }

            await fetchUsers();

            await Swal.fire(
                "Berhasil",
                "Pengguna berhasil dihapus.",
                "success"
            );
        } catch (error) {
            showRequestError(
                error,
                "Pengguna gagal dihapus."
            );
        } finally {
            setActionLoading(null);
        }
    }

    const stats =
        dashboardStats(users);

    const columns =
        userTableColumns({
            currentUser,
            onDetail: openUser,
            onEdit: openEditModal,
            onResetPassword:
                openResetModal,
            onApprove: handleApprove,
            onReject: openRejectModal,
            onDisable: handleDisable,
            onEnable: handleEnable,
            onDelete: handleDelete,
            actionLoading
        });

    return (
        <div className="space-y-8">
            {/* Header Dashboard */}

            <section
                className="
                    flex
                    flex-col
                    gap-5
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    p-6
                    shadow-sm
                    md:flex-row
                    md:items-center
                    md:justify-between
                "
            >
                <div className="flex items-center gap-4">
                    <div
                        className="
                            flex
                            h-12
                            w-12
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            bg-blue-100
                            text-blue-700
                        "
                    >
                        <Users size={24} />
                    </div>

                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">
                            Dashboard Admin
                        </h1>

                        <p className="mt-1 text-slate-500">
                            Monitoring dan
                            pengelolaan seluruh
                            pengguna sistem.
                        </p>
                    </div>
                </div>

                {canCreateUsers(
                    currentUser
                ) && (
                    <button
                        type="button"
                        onClick={
                            openCreateModal
                        }
                        className="
                            inline-flex
                            w-fit
                            cursor-pointer
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            bg-blue-600
                            px-5
                            py-3
                            text-sm
                            font-semibold
                            text-white
                            shadow-sm
                            transition
                            hover:bg-blue-700
                            hover:shadow-md
                            focus:outline-none
                            focus:ring-2
                            focus:ring-blue-500
                            focus:ring-offset-2
                        "
                    >
                        <Plus size={18} />

                        Tambah Pengguna
                    </button>
                )}
            </section>

            {/* Statistik */}

            <DashboardStats
                stats={stats}
            />

            {/* Table */}

            <Table
                title="Data User"
                subtitle={
                    listLoading
                        ? "Memuat data pengguna..."
                        : "Seluruh data pengguna yang terdaftar"
                }
                columns={columns}
                data={users}
                search
                searchPlaceHolder="Cari User"
            />

            {/* Detail User */}

            <UserDetailModal
                user={selectedUser}
                currentUser={currentUser}
                onClose={closeUser}
                onEdit={openEditModal}
                onResetPassword={
                    openResetModal
                }
                onApprove={
                    handleApprove
                }
                onReject={
                    openRejectModal
                }
                onDisable={
                    handleDisable
                }
                onEnable={
                    handleEnable
                }
                onDelete={
                    handleDelete
                }
                actionLoading={
                    actionLoading
                }
            />

            {/* Form User */}

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

            {/* Reset Password */}

            <ResetPasswordModal
                open={Boolean(
                    resetTarget
                )}
                user={resetTarget}
                loading={submitting}
                errors={resetErrors}
                onClose={closeResetModal}
                onSubmit={
                    submitResetPassword
                }
            />

            {/* Reject User */}

            <RejectUserModal
                open={Boolean(
                    rejectTarget
                )}
                user={rejectTarget}
                loading={submitting}
                errors={rejectErrors}
                onClose={
                    closeRejectModal
                }
                onSubmit={submitReject}
            />
        </div>
    );
}

function validationErrors(error) {
    return (
        error.response?.data?.errors ??
        {}
    );
}

function requestMessage(
    error,
    fallback
) {
    if (
        error.response?.status === 403
    ) {
        return (
            error.response?.data?.message ??
            "Akses ditolak."
        );
    }

    if (
        error.response?.status === 404
    ) {
        return (
            error.response?.data?.message ??
            "User tidak ditemukan."
        );
    }

    if (
        error.response?.status === 422
    ) {
        return (
            error.response?.data?.message ??
            "Data tidak valid."
        );
    }

    if (
        error.response?.status >= 500
    ) {
        return "Terjadi kesalahan server.";
    }

    return (
        error.response?.data?.message ??
        fallback
    );
}

function showRequestError(
    error,
    fallback
) {
    Swal.fire(
        "Gagal",
        requestMessage(
            error,
            fallback
        ),
        "error"
    );
}