import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";
import {
    useLocation,
    useNavigate,
    useSearchParams
} from "react-router-dom";
import Swal from "sweetalert2";
import {
    ArrowLeft,
    ChevronLeft,
    ChevronRight,
    Download,
    FileText,
    Loader2,
    MoveRight,
    Trash2,
    Upload,
    X
} from "lucide-react";

import Navbar from "../components/layout/Navbar";
import { API_ORIGIN } from "../config/api";
import {
    deleteAdminGroupFile,
    deleteGroupFile,
    getGroupFiles,
    moveAdminGroupFile,
    uploadAdminGroupFile,
    uploadGroupFile
} from "../services/groupFileService";
import { me } from "../services/authService";
import { getGroups } from "../services/userService";
import { getServices } from "../services/serviceService";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

function formatFileSize(bytes = 0) {
    if (bytes < 1024) {
        return `${bytes} B`;
    }

    const kiloBytes = bytes / 1024;

    if (kiloBytes < 1024) {
        return `${kiloBytes.toFixed(2)} KB`;
    }

    return `${(kiloBytes / 1024).toFixed(2)} MB`;
}

function formatDate(date) {
    if (!date) return "-";

    return new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    }).format(new Date(date));
}

function getFileUrl(filePath) {
    if (!filePath) return null;

    if (/^https?:\/\//i.test(filePath)) {
        return filePath;
    }

    return `${API_ORIGIN}/storage/${filePath}`;
}

function getErrorMessage(error, fallback) {
    if (error.response?.status === 403) {
        return "Anda tidak memiliki akses untuk file ini.";
    }

    if (error.response?.status === 404) {
        return "File tidak ditemukan.";
    }

    return error.response?.data?.message || fallback;
}

export default function GroupFiles() {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const fileInputRef = useRef(null);

    const requestedGroupId =
        searchParams.get("group_id") ??
        location.state?.groupId ??
        "";
    const requestedOptionId =
        searchParams.get("option_id") ??
        location.state?.optionId ??
        "";

    const requestedServiceName =
        location.state?.serviceName || "";

    const requestedOptionName =
        location.state?.optionName || "";
    const requestedGroupName =
        location.state?.groupName || "";

    const [group, setGroup] = useState(null);
    const [files, setFiles] = useState([]);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        total: 0
    });

    const [currentUser, setCurrentUser] = useState(null);
    const [groups, setGroups] = useState([]);
    const [services, setServices] = useState([]);
    const [selectedGroupId, setSelectedGroupId] = useState(
        requestedGroupId || ""
    );
    const [selectedOptionId, setSelectedOptionId] = useState(
        requestedOptionId || ""
    );
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const currentPage = pagination.current_page || 1;
    const lastPage = pagination.last_page || 1;

    const isUser = currentUser?.role === "user";
    const isViewer = currentUser?.role === "viewer";
    const isAdmin = ["admin", "super_admin"].includes(
        currentUser?.role
    );
    const activeGroupId =
        requestedGroupId || selectedGroupId;
    const activeOptionId =
        requestedOptionId || selectedOptionId;


    const canUpload = isUser || isAdmin;

    const selectedService = useMemo(() => {
        return services.find(
            (service) =>
                Number(service.group?.id) ===
                Number(activeGroupId)
        );
    }, [
        activeGroupId,
        services
    ]);

    const serviceOptions = useMemo(
        () => selectedService?.options ?? [],
        [selectedService]
    );

    const selectedOption = useMemo(() => {
        const optionId = Number(activeOptionId);

        if (Number.isFinite(optionId) && optionId > 0) {
            const option = serviceOptions.find(
                (item) =>
                    Number(item.id) === optionId
            );

            if (option) {
                return option;
            }
        }

        return serviceOptions[0] ?? null;
    }, [
        activeOptionId,
        serviceOptions
    ]);

    const optionName =
        selectedOption?.name ||
        requestedOptionName;

    const subtitle = useMemo(() => {
        if (group?.name) {
            return `Group: ${group.name}`;
        }

        if (requestedGroupName) {
            return `Group: ${requestedGroupName}`;
        }

        const displayGroupId =
            isAdmin || isUser
                ? activeGroupId
                : requestedGroupId;

        if (displayGroupId) {
            return `Group: group-${displayGroupId}`;
        }

        if (isAdmin || isUser) {
            return "Semua group";
        }

        return "Group belum tersedia";
    }, [
        group,
        requestedGroupName,
        requestedGroupId,
        activeGroupId,
        isAdmin,
        isUser
    ]);

    const serviceName = useMemo(() => {
        if (requestedServiceName) {
            return requestedServiceName;
        }

        return selectedService?.name ?? "Layanan";
    }, [
        requestedServiceName,
        selectedService
    ]);

    const handleUnauthorized = useCallback(
        (err) => {
            if (err.response?.status !== 401) {
                return false;
            }

            localStorage.removeItem("token");
            localStorage.removeItem("user");

            navigate("/login", {
                replace: true
            });

            return true;
        },
        [navigate]
    );

    const fetchFiles = useCallback(
        async (page = 1) => {
            setLoading(true);
            setError("");

            try {


                const groupId =
                    isAdmin || isUser ? activeGroupId : requestedGroupId;
                const optionId =
                    selectedOption?.id ?? activeOptionId;

                const response = await getGroupFiles(
                    page,
                    groupId,
                    optionId
                );

                const payload = response.data.data;
                const fileData = payload?.files;

                setGroup(payload?.group ?? null);
                setFiles(fileData?.data ?? []);

                setPagination({
                    current_page:
                        fileData?.current_page ?? 1,
                    last_page:
                        fileData?.last_page ?? 1,
                    total:
                        fileData?.total ?? 0
                });
            } catch (err) {
                if (handleUnauthorized(err)) {
                    return;
                }

                setError(
                    getErrorMessage(
                        err,
                        "Gagal mengambil data file group."
                    )
                );
            } finally {
                setLoading(false);
            }
        },
        [
            handleUnauthorized,
            requestedGroupId,
            activeGroupId,
            activeOptionId,
            selectedOption,
            isAdmin,
            isUser
        ]
    );

    useEffect(() => {
        let ignore = false;

        async function loadInitialData() {
            setLoading(true);
            setError("");

            try {
                const [
                    userResponse,
                    groupResponse,
                    serviceResponse
                ] = await Promise.all([
                    me(),
                    getGroups(),
                    getServices()
                ]);

                const user =
                    userResponse.data.data ??
                    userResponse.data.user;
                const serviceData =
                    serviceResponse.data.data ?? [];
                const role = user?.role;
                const shouldUseSelectedGroup =
                    ["admin", "super_admin", "user"].includes(role);
                const groupId = shouldUseSelectedGroup
                    ? activeGroupId
                    : requestedGroupId;
                const service = serviceData.find(
                    (item) =>
                        Number(item.group?.id) ===
                        Number(groupId)
                );
                const requestedOption =
                    service?.options?.find(
                        (item) =>
                            Number(item.id) ===
                            Number(activeOptionId)
                    );
                const optionId =
                    requestedOption?.id ??
                    service?.options?.[0]?.id ??
                    "";

                const fileResponse =
                    await getGroupFiles(
                        1,
                        groupId,
                        optionId
                    );

                if (ignore) {
                    return;
                }

                if (user) {
                    localStorage.setItem(
                        "user",
                        JSON.stringify(user)
                    );
                }

                const payload = fileResponse.data.data;
                const fileData = payload?.files;

                setCurrentUser(user ?? null);
                setGroups(groupResponse.data.data ?? []);
                setServices(serviceData);
                setSelectedGroupId(groupId || "");
                setSelectedOptionId(optionId || "");
                setGroup(payload?.group ?? null);
                setFiles(fileData?.data ?? []);
                setPagination({
                    current_page:
                        fileData?.current_page ?? 1,
                    last_page:
                        fileData?.last_page ?? 1,
                    total:
                        fileData?.total ?? 0
                });
            } catch (err) {
                if (
                    !ignore &&
                    !handleUnauthorized(err)
                ) {
                    setError(
                        getErrorMessage(
                            err,
                            "Gagal mengambil data file group."
                        )
                    );
                }
            } finally {
                if (!ignore) {
                    setLoading(false);
                }
            }
        }

        void loadInitialData();

        return () => {
            ignore = true;
        };
    }, [
        activeGroupId,
        activeOptionId,
        handleUnauthorized,
        requestedGroupId
    ]);

    function syncSearchParams(
        groupId,
        optionId
    ) {
        const params = {};

        if (groupId) {
            params.group_id = String(groupId);
        }

        if (optionId) {
            params.option_id = String(optionId);
        }

        setSearchParams(params);
    }

    function handleSelectGroup(groupId) {
        const service = services.find(
            (item) =>
                Number(item.group?.id) ===
                Number(groupId)
        );
        const optionId =
            service?.options?.[0]?.id ?? "";

        setSelectedGroupId(groupId);
        setSelectedOptionId(optionId);
        setPagination({
            current_page: 1,
            last_page: 1,
            total: 0
        });
        syncSearchParams(groupId, optionId);
    }

    function handleSelectOption(optionId) {
        setSelectedOptionId(optionId);
        syncSearchParams(activeGroupId, optionId);
    }

    function closeModal() {
        if (uploading) return;

        setModalOpen(false);
        setSelectedFile(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }

    function openUploadModal() {


        if (!canUpload) {
            return;
        }

        if ((isAdmin || isUser) && !activeGroupId) {
            Swal.fire({
                icon: "warning",
                title: "Pilih group",
                text: "Pilih group tujuan sebelum upload file."
            });

            return;
        }

        if (!selectedOption?.id && !activeOptionId) {
            Swal.fire({
                icon: "warning",
                title: "Pilih opsi layanan",
                text: "Pilih opsi layanan terlebih dahulu."
            });

            return;
        }

        setModalOpen(true);
    }

    function handleFileChange(e) {
        const file = e.target.files?.[0];

        if (!file) {
            setSelectedFile(null);
            return;
        }

        if (file.size > MAX_FILE_SIZE) {
            setSelectedFile(null);
            e.target.value = "";

            Swal.fire({
                icon: "error",
                title: "File terlalu besar",
                text: "Maksimal ukuran file adalah 10 MB."
            });

            return;
        }

        setSelectedFile(file);
    }

    async function handleUpload(e) {
        e.preventDefault();

        if (!canUpload) {
            await Swal.fire({
                icon: "error",
                title: "Akses Ditolak",
                text: "Viewer tidak memiliki akses untuk mengunggah file."
            });

            return;
        }

        if (!selectedFile) {
            await Swal.fire({
                icon: "warning",
                title: "Pilih file",
                text: "Silakan pilih file yang ingin diunggah."
            });

            return;
        }

        const formData = new FormData();

        formData.append(
            "file",
            selectedFile
        );

        if (isUser) {
            formData.append(
                "group_id",
                activeGroupId
            );
        }

        formData.append(
            "service_option_id",
            selectedOption?.id ?? activeOptionId
        );

        setUploading(true);

        try {
            if (isAdmin) {
                await uploadAdminGroupFile(
                    activeGroupId,
                    selectedOption?.id ?? activeOptionId,
                    selectedFile
                );
            } else {
                await uploadGroupFile(formData);
            }

            await Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: "File berhasil diunggah."
            });

            closeModal();

            await fetchFiles(currentPage);
        } catch (err) {
            if (handleUnauthorized(err)) {
                return;
            }

            await Swal.fire({
                icon: "error",
                title: "Gagal",
                text: getErrorMessage(
                    err,
                    "File gagal diunggah."
                )
            });
        } finally {
            setUploading(false);
        }
    }

    async function handleDelete(file) {


        const canDelete =
            isAdmin ||
            (
                currentUser?.role === "user" &&
                Number(file.user_id) ===
                    Number(currentUser?.id)
            );

        if (!canDelete) {
            await Swal.fire({
                icon: "error",
                title: "Akses Ditolak",
                text: "Anda tidak memiliki akses untuk menghapus file ini."
            });

            return;
        }

        const result = await Swal.fire({
            icon: "warning",
            title: "Hapus file?",
            text: `File ${file.original_name} akan dihapus.`,
            showCancelButton: true,
            confirmButtonText: "Hapus",
            cancelButtonText: "Batal",
            confirmButtonColor: "#dc2626"
        });

        if (!result.isConfirmed) {
            return;
        }

        setDeletingId(file.id);

        try {
            if (isAdmin) {
                await deleteAdminGroupFile(file.id);
            } else {
                await deleteGroupFile(file.id);
            }

            await Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: "File berhasil dihapus."
            });

            const nextPage =
                files.length === 1 &&
                currentPage > 1
                    ? currentPage - 1
                    : currentPage;

            await fetchFiles(nextPage);
        } catch (err) {
            if (handleUnauthorized(err)) {
                return;
            }

            await Swal.fire({
                icon: "error",
                title: "Gagal",
                text: getErrorMessage(
                    err,
                    "File gagal dihapus."
                )
            });
        } finally {
            setDeletingId(null);
        }
    }

    async function handleMove(file) {
        if (!isAdmin) {
            return;
        }

        const inputOptions = services.reduce((options, service) => {
            const groupId = service.group?.id;

            if (!groupId) {
                return options;
            }

            (service.options ?? []).forEach((option) => {
                if (
                    Number(groupId) !== Number(file.group_id) ||
                    Number(option.id) !==
                        Number(file.service_option_id)
                ) {
                    options[`${groupId}:${option.id}`] =
                        `${service.name} - ${option.name}`;
                }
            });

            return options;
        }, {});

        const result = await Swal.fire({
            title: "Pindahkan file",
            input: "select",
            inputOptions,
            inputPlaceholder: "Pilih layanan dan opsi tujuan",
            showCancelButton: true,
            confirmButtonText: "Pindahkan",
            cancelButtonText: "Batal",
            inputValidator: (value) => {
                if (!value) {
                    return "Layanan dan opsi tujuan wajib dipilih.";
                }

                return null;
            }
        });

        if (!result.isConfirmed) {
            return;
        }

        try {
            const [
                targetGroupId,
                targetOptionId
            ] = String(result.value).split(":");

            if (!targetGroupId || !targetOptionId) {
                await Swal.fire(
                    "Gagal",
                    "Layanan dan opsi tujuan tidak valid.",
                    "error"
                );

                return;
            }

            await moveAdminGroupFile(
                file.id,
                targetGroupId,
                targetOptionId
            );

            await Swal.fire(
                "Berhasil",
                "File berhasil dipindahkan.",
                "success"
            );

            await fetchFiles(currentPage);
        } catch (err) {
            await Swal.fire(
                "Gagal",
                getErrorMessage(err, "File gagal dipindahkan."),
                "error"
            );
        }
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <main className="mx-auto max-w-7xl px-6 pb-12 pt-28">
                <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                type="button"
                                onClick={() =>
                                    navigate("/", {
                                        replace: true
                                    })
                                }
                                className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-slate-50 transition hover:bg-slate-100"
                                title="Kembali ke beranda"
                            >
                                <ArrowLeft size={20} />
                            </button>

                            <div>
                                <h1 className="text-3xl font-bold text-slate-800">
                                    {optionName || "File Group"}
                                </h1>

                                <p className="mt-1 text-slate-500">
                                    {serviceName} • {subtitle}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                            {(isAdmin ||
                                (isUser && !activeOptionId)) && (
                                <select
                                    value={activeGroupId}
                                    disabled={
                                        isUser &&
                                        Boolean(activeOptionId)
                                    }
                                    onChange={(event) => {
                                        handleSelectGroup(
                                            event.target.value
                                        );
                                    }}
                                    className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">
                                        {isUser ? "Semua group saya" : "Semua group"}
                                    </option>
                                    {groups.map((item) => (
                                        <option
                                            key={item.id}
                                            value={item.id}
                                        >
                                            {item.name}
                                        </option>
                                    ))}
                                </select>
                            )}

                            {serviceOptions.length > 0 && (
                                <select
                                    value={
                                        selectedOption?.id ?? ""
                                    }
                                    onChange={(event) =>
                                        handleSelectOption(
                                            event.target.value
                                        )
                                    }
                                    className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {serviceOptions.map(
                                        (option) => (
                                            <option
                                                key={
                                                    option.id
                                                }
                                                value={
                                                    option.id
                                                }
                                            >
                                                {
                                                    option.name
                                                }
                                            </option>
                                        )
                                    )}
                                </select>
                            )}

                            <div className="rounded-xl bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700">
                                {serviceName}
                            </div>

                            {optionName && (
                                <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                                    {optionName}
                                </div>
                            )}

                            {canUpload && (
                                <>
                                    <div className="rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-500">
                                        Maksimal ukuran file 10 MB
                                    </div>

                                    <button
                                        type="button"
                                        onClick={openUploadModal}
                                        className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
                                    >
                                        <Upload size={18} />
                                        Upload File
                                    </button>
                                </>
                            )}

                            {isViewer && (
                                <div className="rounded-xl bg-slate-100 px-4 py-3 text-sm font-medium text-slate-600">
                                    Mode hanya lihat
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {loading ? (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white py-16 text-slate-500 shadow-sm">
                        <Loader2
                            className="mb-3 animate-spin"
                            size={28}
                        />

                        Memuat data file...
                    </div>
                ) : error ? (
                    <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
                        <p className="font-semibold text-red-600">
                            {error}
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                fetchFiles(currentPage)
                            }
                            className="mt-5 cursor-pointer rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
                        >
                            Coba Lagi
                        </button>
                    </div>
                ) : files.length === 0 ? (
                    <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
                        <FileText
                            size={44}
                            className="mx-auto mb-4 text-slate-400"
                        />

                        <p className="font-semibold text-slate-600">
                            Belum ada file pada group ini.
                        </p>

                        {canUpload && (
                            <button
                                type="button"
                                onClick={openUploadModal}
                                className="mt-5 inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
                            >
                                <Upload size={18} />
                                Upload File
                            </button>
                        )}
                    </div>
                ) : (
                    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-6 py-5">
                            <div>
                                <h2 className="text-xl font-semibold text-slate-800">
                                    Daftar File
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Total {pagination.total} file
                                </p>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-slate-50">
                                        <th className="px-6 py-4 text-left text-sm font-semibold uppercase text-slate-600">
                                            Nama File
                                        </th>

                                        <th className="px-6 py-4 text-left text-sm font-semibold uppercase text-slate-600">
                                            Uploader
                                        </th>

                                        {isAdmin && (
                                            <th className="px-6 py-4 text-left text-sm font-semibold uppercase text-slate-600">
                                                Group
                                            </th>
                                        )}

                                        <th className="px-6 py-4 text-left text-sm font-semibold uppercase text-slate-600">
                                            Tipe
                                        </th>

                                        <th className="px-6 py-4 text-left text-sm font-semibold uppercase text-slate-600">
                                            Ukuran
                                        </th>

                                        <th className="px-6 py-4 text-left text-sm font-semibold uppercase text-slate-600">
                                            Tanggal Upload
                                        </th>

                                        <th className="px-6 py-4 text-center text-sm font-semibold uppercase text-slate-600">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {files.map(
                                        (
                                            file,
                                            index
                                        ) => {
                                            const fileUrl =
                                                getFileUrl(
                                                    file.file_path
                                                );

                                            const canDelete =
                                                isAdmin ||
                                                (
                                                    currentUser?.role ===
                                                        "user" &&
                                                    Number(
                                                        file.user_id
                                                    ) ===
                                                        Number(
                                                            currentUser?.id
                                                        )
                                                );

                                            return (
                                                <tr
                                                    key={file.id}
                                                    className={`
                                                        border-t
                                                        border-slate-100
                                                        transition-colors
                                                        hover:bg-blue-50
                                                        ${
                                                            index % 2 === 0
                                                                ? "bg-white"
                                                                : "bg-slate-50/40"
                                                        }
                                                    `}
                                                >
                                                    <td className="min-w-64 px-6 py-4 text-sm font-medium text-slate-700">
                                                        {
                                                            file.original_name
                                                        }
                                                    </td>

                                                    <td className="px-6 py-4 text-sm text-slate-700">
                                                        {file.user
                                                            ?.nama ||
                                                            "-"}
                                                    </td>

                                                    {isAdmin && (
                                                        <td className="px-6 py-4 text-sm text-slate-700">
                                                            {file.group
                                                                ?.name ||
                                                                `group-${file.group_id}`}
                                                        </td>
                                                    )}

                                                    <td className="px-6 py-4 text-sm text-slate-700">
                                                        {file.mime_type ||
                                                            "-"}
                                                    </td>

                                                    <td className="px-6 py-4 text-sm text-slate-700">
                                                        {formatFileSize(
                                                            file.file_size
                                                        )}
                                                    </td>

                                                    <td className="min-w-52 px-6 py-4 text-sm text-slate-700">
                                                        {formatDate(
                                                            file.created_at
                                                        )}
                                                    </td>

                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center justify-center gap-2">
                                                            {fileUrl && (
                                                                <a
                                                                    href={
                                                                        fileUrl
                                                                    }
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700 transition hover:bg-blue-200"
                                                                    title="Lihat atau download"
                                                                >
                                                                    <Download
                                                                        size={
                                                                            18
                                                                        }
                                                                    />
                                                                </a>
                                                            )}

                                                            {isAdmin && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleMove(
                                                                            file
                                                                        )
                                                                    }
                                                                    className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 transition hover:bg-emerald-200"
                                                                    title="Pindahkan file"
                                                                >
                                                                    <MoveRight
                                                                        size={
                                                                            18
                                                                        }
                                                                    />
                                                                </button>
                                                            )}

                                                            {canDelete && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleDelete(
                                                                            file
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        deletingId ===
                                                                        file.id
                                                                    }
                                                                    className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl bg-red-100 text-red-700 transition hover:bg-red-200 disabled:cursor-not-allowed disabled:opacity-60"
                                                                    title="Hapus file"
                                                                >
                                                                    {deletingId ===
                                                                    file.id ? (
                                                                        <Loader2
                                                                            size={
                                                                                18
                                                                            }
                                                                            className="animate-spin"
                                                                        />
                                                                    ) : (
                                                                        <Trash2
                                                                            size={
                                                                                18
                                                                            }
                                                                        />
                                                                    )}
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        }
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex flex-col gap-3 border-t border-slate-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-sm text-slate-500">
                                Halaman {currentPage} dari{" "}
                                {lastPage}
                            </p>

                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() =>
                                        fetchFiles(
                                            currentPage - 1
                                        )
                                    }
                                    disabled={
                                        currentPage <= 1
                                    }
                                    className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <ChevronLeft
                                        size={18}
                                    />
                                    Sebelumnya
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        fetchFiles(
                                            currentPage + 1
                                        )
                                    }
                                    disabled={
                                        currentPage >=
                                        lastPage
                                    }
                                    className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Berikutnya
                                    <ChevronRight
                                        size={18}
                                    />
                                </button>
                            </div>
                        </div>
                    </section>
                )}
            </main>

            {modalOpen && canUpload && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                    <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
                        <div className="flex items-center justify-between border-b border-slate-200 p-6">
                            <div>
                                <h2 className="text-xl font-bold text-slate-800">
                                    Upload File
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Layanan: {serviceName}
                                </p>

                                <p className="mt-1 text-sm text-slate-500">
                                    Opsi: {optionName || "-"}
                                </p>

                                <p className="mt-1 text-sm text-slate-500">
                                    {subtitle}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={closeModal}
                                disabled={uploading}
                                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form
                            onSubmit={handleUpload}
                            className="space-y-5 p-6"
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                onChange={handleFileChange}
                                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />

                            {selectedFile && (
                                <div className="rounded-xl bg-slate-100 p-4 text-sm text-slate-600">
                                    <p className="font-semibold text-slate-800">
                                        {
                                            selectedFile.name
                                        }
                                    </p>

                                    <p className="mt-1">
                                        {formatFileSize(
                                            selectedFile.size
                                        )}
                                    </p>
                                </div>
                            )}

                            <div className="flex items-center justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    disabled={uploading}
                                    className="cursor-pointer rounded-xl border border-slate-200 px-5 py-3 text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    Batal
                                </button>

                                <button
                                    type="submit"
                                    disabled={
                                        uploading ||
                                        !selectedFile
                                    }
                                    className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {uploading && (
                                        <Loader2
                                            size={18}
                                            className="animate-spin"
                                        />
                                    )}

                                    Upload
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
