import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";
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
import UserTableColumns from "../components/dashboard/UserTableColumns";
import { canCreateUsers } from "../utils/userPermissions";

const emptyFilters = {
    search: "",
    role: "",
    group_id: "",
    sts: "",
    approval: "",
    date_from: "",
    date_to: ""
};

export default function Dashboard() {
    const latestRequestId = useRef(0);

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

    const [filters, setFilters] =
        useState(emptyFilters);

    const [debouncedSearch, setDebouncedSearch] =
        useState("");

    const [page, setPage] = useState(1);

    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        total: 0,
        per_page: 25
    });

    const roleOptions = useMemo(() => {
        if (currentUser?.role === "super_admin") {
            return [
                {
                    value: "admin",
                    label: "Admin"
                },
                {
                    value: "user",
                    label: "User"
                },
                {
                    value: "viewer",
                    label: "Viewer"
                }
            ];
        }

        return [
            {
                value: "user",
                label: "User"
            },
            {
                value: "viewer",
                label: "Viewer"
            }
        ];
    }, [currentUser]);

    const isFilterEmpty = useMemo(() => {
        return Object.values(filters).every(
            (value) => !value
        );
    }, [filters]);

    useEffect(() => {
        let ignore = false;

        async function loadInitialData() {
            try {
                const [
                    userResponse,
                    groupResponse
                ] = await Promise.all([
                    me(),
                    getGroups()
                ]);

                if (ignore) {
                    return;
                }

                const payload =
                    userResponse.data.data ??
                    userResponse.data.user;

                setCurrentUser(payload);
                setGroups(
                    groupResponse.data.data ?? []
                );

                if (payload) {
                    localStorage.setItem(
                        "user",
                        JSON.stringify(payload)
                    );
                }
            } catch (error) {
                if (!ignore) {
                    showRequestError(
                        error,
                        "Gagal mengambil data awal dashboard."
                    );
                }
            }
        }

        void loadInitialData();

        return () => {
            ignore = true;
        };
    }, []);

    useEffect(() => {
        const timeout = window.setTimeout(() => {
            setDebouncedSearch(filters.search);
            setPage(1);
        }, 400);

        return () => window.clearTimeout(timeout);
    }, [filters.search]);

    useEffect(() => {
        let ignore = false;
        const requestId =
            latestRequestId.current + 1;

        latestRequestId.current = requestId;

        async function loadUsers() {
            setListLoading(true);

            try {
                const response =
                    await getAllUsers(
                        userListParams(
                            {
                                ...filters,
                                search: debouncedSearch
                            },
                            page,
                            pagination.per_page
                        )
                    );

                if (
                    ignore ||
                    latestRequestId.current !== requestId
                ) {
                    return;
                }

                const payload =
                    response.data.data;

                setUsers(
                    payload?.data ??
                    payload ??
                    []
                );

                setPagination({
                    current_page:
                        payload?.current_page ?? page,
                    last_page:
                        payload?.last_page ?? 1,
                    total:
                        payload?.total ?? 0,
                    per_page:
                        payload?.per_page ??
                        pagination.per_page
                });
            } catch (error) {
                if (!ignore) {
                    showRequestError(
                        error,
                        "Gagal mengambil data pengguna."
                    );
                }
            } finally {
                if (
                    !ignore &&
                    latestRequestId.current === requestId
                ) {
                    setListLoading(false);
                }
            }
        }

        void loadUsers();

        return () => {
            ignore = true;
        };
    }, [
        debouncedSearch,
        filters,
        page,
        pagination.per_page
    ]);

    const fetchUsers = useCallback(async () => {
        try {
            setListLoading(true);

            const response =
                await getAllUsers(
                    userListParams(
                        {
                            ...filters,
                            search: debouncedSearch
                        },
                        page,
                        pagination.per_page
                    )
                );

            const payload =
                response.data.data;

            setUsers(
                payload?.data ??
                payload ??
                []
            );
            setPagination({
                current_page:
                    payload?.current_page ?? page,
                last_page:
                    payload?.last_page ?? 1,
                total:
                    payload?.total ?? 0,
                per_page:
                    payload?.per_page ??
                    pagination.per_page
            });
        } catch (error) {
            showRequestError(
                error,
                "Gagal mengambil data pengguna."
            );
        } finally {
            setListLoading(false);
        }
    }, [
        debouncedSearch,
        filters,
        page,
        pagination.per_page
    ]);

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
            title: `Setujui ${user.nama}?`,
            text:
                "User akan disetujui dan OTP aktivasi dikirim ke WhatsApp.",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Setujui & Kirim OTP",
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
                "User disetujui dan OTP berhasil dikirim.",
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

    function updateFilter(name, value) {
        setFilters((current) => ({
            ...current,
            [name]: value
        }));

        if (name !== "search") {
            setPage(1);
        }
    }

    function resetFilters() {
        setFilters(emptyFilters);
        setDebouncedSearch("");
        setPage(1);
    }

    const stats =
        dashboardStats(users);

    const columns =
        UserTableColumns({
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

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-6">
                    <input
                        type="text"
                        value={filters.search}
                        onChange={(event) =>
                            updateFilter(
                                "search",
                                event.target.value
                            )
                        }
                        placeholder="Cari nama, NIK, telepon, instansi, atau jabatan..."
                        className="rounded-xl border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 lg:col-span-2"
                    />

                    <select
                        value={filters.role}
                        onChange={(event) =>
                            updateFilter(
                                "role",
                                event.target.value
                            )
                        }
                        className="rounded-xl border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">
                            Semua Role
                        </option>

                        {roleOptions.map((role) => (
                            <option
                                key={role.value}
                                value={role.value}
                            >
                                {role.label}
                            </option>
                        ))}
                    </select>

                    <select
                        value={filters.group_id}
                        onChange={(event) =>
                            updateFilter(
                                "group_id",
                                event.target.value
                            )
                        }
                        className="rounded-xl border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">
                            Semua Group
                        </option>

                        {groups.map((group) => (
                            <option
                                key={group.id}
                                value={group.id}
                            >
                                {group.name}
                            </option>
                        ))}
                    </select>

                    <select
                        value={filters.sts}
                        onChange={(event) =>
                            updateFilter(
                                "sts",
                                event.target.value
                            )
                        }
                        className="rounded-xl border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">
                            Semua Status
                        </option>
                        <option value="pending">
                            Pending
                        </option>
                        <option value="aktif">
                            Aktif
                        </option>
                        <option value="disabled">
                            Disabled
                        </option>
                    </select>

                    <select
                        value={filters.approval}
                        onChange={(event) =>
                            updateFilter(
                                "approval",
                                event.target.value
                            )
                        }
                        className="rounded-xl border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">
                            Semua Approval
                        </option>
                        <option value="pending">
                            Pending
                        </option>
                        <option value="approved">
                            Approved
                        </option>
                        <option value="rejected">
                            Rejected
                        </option>
                    </select>

                    <input
                        type="date"
                        value={filters.date_from}
                        onChange={(event) =>
                            updateFilter(
                                "date_from",
                                event.target.value
                            )
                        }
                        className="rounded-xl border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <input
                        type="date"
                        value={filters.date_to}
                        onChange={(event) =>
                            updateFilter(
                                "date_to",
                                event.target.value
                            )
                        }
                        className="rounded-xl border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <button
                        type="button"
                        onClick={resetFilters}
                        disabled={isFilterEmpty}
                        className="cursor-pointer rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Reset Filter
                    </button>
                </div>
            </section>

            <Table
                title="Data User"
                subtitle={
                    listLoading
                        ? "Memuat data pengguna..."
                        : "Seluruh data pengguna yang terdaftar"
                }
                columns={columns}
                data={users}
                search={false}
                pagination={false}
                searchPlaceHolder="Cari User"
            />

            <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white px-6 py-4 text-sm text-slate-600 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                <span>
                    Total {pagination.total} data • Halaman{" "}
                    {pagination.current_page} dari{" "}
                    {pagination.last_page}
                </span>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() =>
                            setPage((current) =>
                                Math.max(current - 1, 1)
                            )
                        }
                        disabled={
                            listLoading ||
                            pagination.current_page <= 1
                        }
                        className="rounded-lg border px-4 py-2 font-medium transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Prev
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            setPage((current) =>
                                Math.min(
                                    current + 1,
                                    pagination.last_page
                                )
                            )
                        }
                        disabled={
                            listLoading ||
                            pagination.current_page >=
                                pagination.last_page
                        }
                        className="rounded-lg border px-4 py-2 font-medium transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>

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
                key={`${formModal.mode}-${formModal.user?.id ?? "new"}`}
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
                key={`reset-${resetTarget?.id ?? "none"}`}
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
                key={`reject-${rejectTarget?.id ?? "none"}`}
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

function userListParams(
    filters,
    page,
    perPage
) {
    return {
        page,
        per_page: perPage,
        search: filters.search || undefined,
        role: filters.role || undefined,
        group_id: filters.group_id || undefined,
        sts: filters.sts || undefined,
        approval: filters.approval || undefined,
        date_from: filters.date_from || undefined,
        date_to: filters.date_to || undefined
    };
}
