import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";
import Swal from "sweetalert2";
import {
    ArrowDown,
    ArrowUp,
    ChevronLeft,
    ChevronRight,
    Download,
    FileText,
    FolderCog,
    FolderInput,
    Loader2,
    Pencil,
    Plus,
    Save,
    Trash2,
    Upload,
    X
} from "lucide-react";

import { API_ORIGIN } from "../config/api";
import {
    deleteAdminGroupFile,
    getGroupFiles,
    moveAdminGroupFile,
    uploadAdminGroupFile
} from "../services/groupFileService";
import {
    getAdminServices,
    updateAdminService
} from "../services/serviceService";

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

function formatDate(value) {
    if (!value) {
        return "-";
    }

    return new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    }).format(new Date(value));
}

function getFileUrl(filePath) {
    if (!filePath) {
        return null;
    }

    if (/^https?:\/\//i.test(filePath)) {
        return filePath;
    }

    return `${API_ORIGIN}/storage/${filePath}`;
}

function getErrorMessage(error, fallback) {
    if (error.response?.status === 401) {
        return "Sesi telah berakhir. Silakan login kembali.";
    }

    if (error.response?.status === 403) {
        return (
            error.response?.data?.message ??
            "Anda tidak memiliki akses."
        );
    }

    if (error.response?.status === 404) {
        return (
            error.response?.data?.message ??
            "Data tidak ditemukan."
        );
    }

    if (error.response?.status === 422) {
        return (
            error.response?.data?.message ??
            "Data yang dikirim tidak valid."
        );
    }

    if (error.response?.status >= 500) {
        return "Terjadi kesalahan pada server.";
    }

    return (
        error.response?.data?.message ??
        fallback
    );
}

function getFilesFromResponse(response) {
    const payload =
        response.data.data;

    const fileData =
        payload?.files;

    return {
        files: fileData?.data ?? [],
        pagination: {
            current_page:
                fileData?.current_page ?? 1,
            last_page:
                fileData?.last_page ?? 1,
            total:
                fileData?.total ?? 0
        }
    };
}

function firstOptionIdForGroup(
    services,
    groupId
) {
    return services.find(
        (service) =>
            Number(service.group?.id) === Number(groupId)
    )?.options?.[0]?.id ?? "";
}

export default function ManageServices() {
    const fileInputRef = useRef(null);

    const [services, setServices] =
        useState([]);

    const [selectedGroupId, setSelectedGroupId] =
        useState("");

    const [selectedFileOptionId, setSelectedFileOptionId] =
        useState("");

    const [files, setFiles] =
        useState([]);

    const [pagination, setPagination] =
        useState({
            current_page: 1,
            last_page: 1,
            total: 0
        });

    const [loading, setLoading] =
        useState(false);

    const [loadingServices, setLoadingServices] =
        useState(true);

    const [error, setError] =
        useState("");

    const [serviceError, setServiceError] =
        useState("");

    const [uploadModalOpen, setUploadModalOpen] =
        useState(false);

    const [selectedFile, setSelectedFile] =
        useState(null);

    const [uploading, setUploading] =
        useState(false);

    const [deletingId, setDeletingId] =
        useState(null);

    const [moveTarget, setMoveTarget] =
        useState(null);

    const [targetGroupId, setTargetGroupId] =
        useState("");

    const [targetOptionId, setTargetOptionId] =
        useState("");

    const [moving, setMoving] =
        useState(false);

    const [editModalOpen, setEditModalOpen] =
        useState(false);

    const [editForm, setEditForm] =
        useState(null);

    const [savingService, setSavingService] =
        useState(false);

    const [validationErrors, setValidationErrors] =
        useState({});

    const currentPage =
        pagination.current_page || 1;

    const lastPage =
        pagination.last_page || 1;

    const groups = useMemo(() => {
        return services
            .map((service) => ({
                id: service.group?.id,
                name: service.group?.name,
                serviceId: service.id,
                serviceName: service.name,
                isActive: service.is_active
            }))
            .filter((group) => group.id)
            .sort(
                (a, b) =>
                    Number(a.id) -
                    Number(b.id)
            );
    }, [services]);

    const selectedGroup = useMemo(() => {
        return groups.find(
            (group) =>
                Number(group.id) ===
                Number(selectedGroupId)
        );
    }, [
        groups,
        selectedGroupId
    ]);

    const selectedService = useMemo(() => {
        return services.find(
            (service) =>
                Number(service.group?.id) ===
                Number(selectedGroupId)
        );
    }, [
        services,
        selectedGroupId
    ]);

    const selectedFileOption = useMemo(() => {
        return (selectedService?.options ?? []).find(
            (option) =>
                Number(option.id) ===
                Number(selectedFileOptionId)
        );
    }, [
        selectedFileOptionId,
        selectedService
    ]);

    const targetGroup = useMemo(() => {
        return groups.find(
            (group) =>
                Number(group.id) ===
                Number(targetGroupId)
        );
    }, [
        groups,
        targetGroupId
    ]);

    const targetService = useMemo(() => {
        return services.find(
            (service) =>
                Number(service.group?.id) ===
                Number(targetGroupId)
        );
    }, [
        services,
        targetGroupId
    ]);

    const fetchFiles = useCallback(
        async (
            groupId,
            page = 1,
            serviceOptionId = ""
        ) => {
            if (!groupId) {
                setLoading(false);
                return;
            }

            setLoading(true);
            setError("");

            try {
                const response =
                    await getGroupFiles(
                        page,
                        groupId,
                        serviceOptionId
                    );

                const filePayload =
                    getFilesFromResponse(response);

                setFiles(
                    filePayload.files
                );

                setPagination(
                    filePayload.pagination
                );
            } catch (error) {
                setFiles([]);

                setPagination({
                    current_page: 1,
                    last_page: 1,
                    total: 0
                });

                setError(
                    getErrorMessage(
                        error,
                        "Gagal mengambil file layanan."
                    )
                );
            } finally {
                setLoading(false);
            }
        },
        []
    );

    useEffect(() => {
        let ignore = false;

        async function loadServices() {
            setLoadingServices(true);
            setServiceError("");

            try {
                const response =
                    await getAdminServices();

                const serviceData =
                    response.data.data ?? [];

                if (ignore) {
                    return;
                }

                setServices(serviceData);

                const nextGroupId =
                    serviceData[0]?.group?.id ?? "";

                setSelectedGroupId(nextGroupId);
                setSelectedFileOptionId(
                    firstOptionIdForGroup(
                        serviceData,
                        nextGroupId
                    )
                );
            } catch (error) {
                if (!ignore) {
                    setServices([]);
                    setServiceError(
                        getErrorMessage(
                            error,
                            "Gagal mengambil data layanan."
                        )
                    );
                }
            } finally {
                if (!ignore) {
                    setLoadingServices(false);
                }
            }
        }

        void loadServices();

        return () => {
            ignore = true;
        };
    }, []);

    useEffect(() => {
        if (!selectedGroupId) {
            return;
        }

        let ignore = false;

        async function loadFiles() {
            setLoading(true);
            setError("");

            try {
                const response =
                    await getGroupFiles(
                        1,
                        selectedGroupId,
                        selectedFileOptionId
                    );

                const filePayload =
                    getFilesFromResponse(response);

                if (!ignore) {
                    setFiles(filePayload.files);
                    setPagination(
                        filePayload.pagination
                    );
                }
            } catch (error) {
                if (!ignore) {
                    setFiles([]);
                    setPagination({
                        current_page: 1,
                        last_page: 1,
                        total: 0
                    });
                    setError(
                        getErrorMessage(
                            error,
                            "Gagal mengambil file layanan."
                        )
                    );
                }
            } finally {
                if (!ignore) {
                    setLoading(false);
                }
            }
        }

        void loadFiles();

        return () => {
            ignore = true;
        };
    }, [
        selectedGroupId,
        selectedFileOptionId
    ]);

    function handleSelectGroup(groupId) {
        if (
            Number(groupId) ===
            Number(selectedGroupId)
        ) {
            return;
        }

        setSelectedGroupId(groupId);
        const service = services.find(
            (item) =>
                Number(item.group?.id) ===
                Number(groupId)
        );
        setSelectedFileOptionId(
            service?.options?.[0]?.id ?? ""
        );
        setFiles([]);

        setPagination({
            current_page: 1,
            last_page: 1,
            total: 0
        });
    }

    function openUploadModal() {
        if (!selectedGroupId) {
            Swal.fire({
                icon: "warning",
                title: "Pilih layanan",
                text:
                    "Pilih layanan sebelum mengunggah file."
            });

            return;
        }

        if (!selectedFileOptionId) {
            Swal.fire({
                icon: "warning",
                title: "Pilih opsi layanan",
                text:
                    "Pilih opsi layanan sebelum mengunggah file."
            });

            return;
        }

        setSelectedFile(null);
        setUploadModalOpen(true);
    }

    function closeUploadModal() {
        if (uploading) {
            return;
        }

        setUploadModalOpen(false);
        setSelectedFile(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }

    function handleFileChange(event) {
        const file =
            event.target.files?.[0];

        if (!file) {
            setSelectedFile(null);
            return;
        }

        if (file.size > MAX_FILE_SIZE) {
            setSelectedFile(null);
            event.target.value = "";

            Swal.fire({
                icon: "error",
                title: "File terlalu besar",
                text:
                    "Maksimal ukuran file adalah 10 MB."
            });

            return;
        }

        setSelectedFile(file);
    }

    function openMoveModal(file) {
        setMoveTarget(file);
        setTargetGroupId("");
    }

    function closeMoveModal() {
        if (moving) {
            return;
        }

        setMoveTarget(null);
        setTargetGroupId("");
        setTargetOptionId("");
    }

    function openEditModal() {
        if (!selectedService) {
            return;
        }

        setValidationErrors({});
        setEditForm({
            id: selectedService.id,
            name: selectedService.name ?? "",
            description:
                selectedService.description ?? "",
            is_active:
                selectedService.is_active === true ||
                selectedService.is_active === 1,
            options: (
                selectedService.options ?? []
            ).map((option, index) => ({
                id: option.id,
                name: option.name ?? "",
                description:
                    option.description ?? "",
                sort_order:
                    option.sort_order ??
                    index + 1,
                is_active:
                    option.is_active === true ||
                    option.is_active === 1
            })),
            deleted_option_ids: []
        });
        setEditModalOpen(true);
    }

    function closeEditModal() {
        if (savingService) {
            return;
        }

        setEditModalOpen(false);
        setEditForm(null);
        setValidationErrors({});
    }

    function updateEditField(field, value) {
        setEditForm((current) => ({
            ...current,
            [field]: value
        }));
    }

    function updateOption(
        index,
        field,
        value
    ) {
        setEditForm((current) => ({
            ...current,
            options: current.options.map(
                (option, optionIndex) =>
                    optionIndex === index
                        ? {
                              ...option,
                              [field]: value
                          }
                        : option
            )
        }));
    }

    function addOption() {
        setEditForm((current) => ({
            ...current,
            options: [
                ...current.options,
                {
                    id: null,
                    name: "",
                    description: "",
                    sort_order:
                        current.options.length + 1,
                    is_active: true
                }
            ]
        }));
    }

    async function removeOption(index) {
        const option = editForm.options[index];

        if (option?.id) {
            const confirmation =
                await Swal.fire({
                    icon: "warning",
                    title: "Hapus opsi?",
                    text:
                        "Opsi lama akan dihapus setelah perubahan disimpan.",
                    showCancelButton: true,
                    confirmButtonText: "Hapus opsi",
                    cancelButtonText: "Batal",
                    confirmButtonColor: "#dc2626"
                });

            if (!confirmation.isConfirmed) {
                return;
            }
        }

        setEditForm((current) => ({
            ...current,
            options: current.options.filter(
                (_, optionIndex) =>
                    optionIndex !== index
            ),
            deleted_option_ids: option?.id
                ? [
                      ...current.deleted_option_ids,
                      option.id
                  ]
                : current.deleted_option_ids
        }));
    }

    function moveOption(index, direction) {
        const nextIndex = index + direction;

        if (
            nextIndex < 0 ||
            nextIndex >= editForm.options.length
        ) {
            return;
        }

        setEditForm((current) => {
            const options = [...current.options];
            const currentOption = options[index];

            options[index] = options[nextIndex];
            options[nextIndex] = currentOption;

            return {
                ...current,
                options
            };
        });
    }

    function getValidationText(field) {
        const value = validationErrors[field];

        if (!value) {
            return "";
        }

        return Array.isArray(value)
            ? value.join(" ")
            : String(value);
    }

    async function handleSaveService(event) {
        event.preventDefault();

        if (savingService || !editForm) {
            return;
        }

        const hasEmptyOption =
            editForm.options.some(
                (option) =>
                    option.name.trim() === ""
            );

        if (
            editForm.name.trim() === "" ||
            hasEmptyOption
        ) {
            await Swal.fire({
                icon: "warning",
                title: "Data belum lengkap",
                text:
                    "Nama layanan dan nama setiap opsi wajib diisi."
            });

            return;
        }

        const payload = {
            name: editForm.name.trim(),
            description:
                editForm.description?.trim() || null,
            is_active: editForm.is_active,
            options: editForm.options.map(
                (option, index) => ({
                    id: option.id,
                    name: option.name.trim(),
                    description:
                        option.description?.trim() ||
                        null,
                    sort_order: index + 1,
                    is_active: option.is_active
                })
            ),
            deleted_option_ids:
                editForm.deleted_option_ids
        };

        setSavingService(true);
        setValidationErrors({});

        try {
            const response =
                await updateAdminService(
                    editForm.id,
                    payload
                );

            const updatedService =
                response.data.data;

            setServices((current) =>
                current
                    .map((service) =>
                        service.id ===
                        updatedService.id
                            ? updatedService
                            : service
                    )
                    .sort(
                        (a, b) =>
                            Number(a.sort_order) -
                            Number(b.sort_order)
                    )
            );

            setEditModalOpen(false);
            setEditForm(null);

            await Swal.fire({
                icon: "success",
                title: "Berhasil",
                text:
                    "Layanan berhasil diperbarui."
            });
        } catch (error) {
            const errors =
                error.response?.data?.errors;

            if (errors) {
                setValidationErrors(errors);
            }

            await Swal.fire({
                icon: "error",
                title: "Gagal",
                text: getErrorMessage(
                    error,
                    "Layanan gagal diperbarui."
                )
            });
        } finally {
            setSavingService(false);
        }
    }

    async function handleUpload(event) {
        event.preventDefault();

        if (!selectedFile) {
            await Swal.fire({
                icon: "warning",
                title: "Pilih file",
                text:
                    "Silakan pilih file yang ingin diunggah."
            });

            return;
        }

        setUploading(true);

        try {
            await uploadAdminGroupFile(
                selectedGroupId,
                selectedFileOptionId,
                selectedFile
            );

            await Swal.fire({
                icon: "success",
                title: "Berhasil",
                text:
                    `File berhasil diunggah ke ${selectedGroup?.serviceName}.`
            });

            setUploadModalOpen(false);
            setSelectedFile(null);

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }

            await fetchFiles(
                selectedGroupId,
                currentPage,
                selectedFileOptionId
            );
        } catch (error) {
            await Swal.fire({
                icon: "error",
                title: "Gagal",
                text: getErrorMessage(
                    error,
                    "File gagal diunggah."
                )
            });
        } finally {
            setUploading(false);
        }
    }

    async function handleMoveFile(event) {
        event.preventDefault();

        if (!moveTarget) {
            return;
        }

        if (!targetGroupId) {
            await Swal.fire({
                icon: "warning",
                title: "Pilih layanan",
                text:
                    "Pilih layanan tujuan terlebih dahulu."
            });

            return;
        }

        if (!targetOptionId) {
            await Swal.fire({
                icon: "warning",
                title: "Pilih opsi tujuan",
                text:
                    "Pilih opsi layanan tujuan terlebih dahulu."
            });

            return;
        }

        if (
            Number(targetGroupId) ===
                Number(selectedGroupId) &&
            Number(targetOptionId) ===
                Number(moveTarget.service_option_id)
        ) {
            await Swal.fire({
                icon: "warning",
                title: "Layanan sama",
                text:
                    "File sudah berada pada layanan tersebut."
            });

            return;
        }

        const confirmation =
            await Swal.fire({
                icon: "question",
                title: "Pindahkan file?",
                html:
                    `File <strong>${moveTarget.original_name}</strong> ` +
                    `akan dipindahkan dari ` +
                    `<strong>${selectedGroup?.serviceName}</strong> ke ` +
                    `<strong>${targetGroup?.serviceName}</strong>.`,
                showCancelButton: true,
                confirmButtonText: "Pindahkan",
                cancelButtonText: "Batal",
                confirmButtonColor: "#f59e0b"
            });

        if (!confirmation.isConfirmed) {
            return;
        }

        setMoving(true);

        try {
            await moveAdminGroupFile(
                moveTarget.id,
                targetGroupId,
                targetOptionId
            );

            await Swal.fire({
                icon: "success",
                title: "Berhasil",
                text:
                    `File berhasil dipindahkan ke ${targetGroup?.serviceName}.`
            });

            setMoveTarget(null);
            setTargetGroupId("");
            setTargetOptionId("");

            const nextPage =
                files.length === 1 &&
                currentPage > 1
                    ? currentPage - 1
                    : currentPage;

            await fetchFiles(
                selectedGroupId,
                nextPage,
                selectedFileOptionId
            );
        } catch (error) {
            await Swal.fire({
                icon: "error",
                title: "Gagal",
                text: getErrorMessage(
                    error,
                    "File gagal dipindahkan."
                )
            });
        } finally {
            setMoving(false);
        }
    }

    async function handleDelete(file) {
        const result = await Swal.fire({
            icon: "warning",
            title: "Hapus file?",
            html:
                `File <strong>${file.original_name}</strong> ` +
                `akan dihapus dari ${selectedGroup?.serviceName}.`,
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
            await deleteAdminGroupFile(
                file.id
            );

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

            await fetchFiles(
                selectedGroupId,
                nextPage,
                selectedFileOptionId
            );
        } catch (error) {
            await Swal.fire({
                icon: "error",
                title: "Gagal",
                text: getErrorMessage(
                    error,
                    "File gagal dihapus."
                )
            });
        } finally {
            setDeletingId(null);
        }
    }

    return (
        <div className="space-y-8">
            {/* Heading */}

            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                        <FolderCog size={24} />
                    </div>

                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">
                            Kelola Layanan
                        </h1>

                        <p className="mt-1 text-slate-500">
                            Kelola file yang tersedia pada setiap layanan.
                        </p>
                    </div>
                </div>
            </div>

            {/* Pilihan layanan */}

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-800">
                    Pilih Layanan
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                    Pilih layanan yang ingin dikelola.
                </p>

                {loadingServices ? (
                    <div className="mt-5 flex items-center gap-3 rounded-xl border border-slate-200 px-5 py-4 text-slate-500">
                        <Loader2
                            size={18}
                            className="animate-spin"
                        />
                        Memuat layanan...
                    </div>
                ) : serviceError ? (
                    <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-600">
                        {serviceError}
                    </div>
                ) : (
                    <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                        {groups.map((group) => {
                            const active =
                                Number(group.id) ===
                                Number(selectedGroupId);

                            return (
                                <button
                                    key={group.id}
                                    type="button"
                                    onClick={() =>
                                        handleSelectGroup(
                                            group.id
                                        )
                                    }
                                    className={`
                                        cursor-pointer
                                        rounded-xl
                                        border
                                        px-5
                                        py-4
                                        text-left
                                        transition
                                        ${
                                            active
                                                ? "border-blue-600 bg-blue-600 text-white shadow-md"
                                                : "border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50"
                                        }
                                    `}
                                >
                                    <p className="font-semibold">
                                        {group.serviceName}
                                    </p>

                                    <p
                                        className={`
                                            mt-1
                                            text-sm
                                            ${
                                                active
                                                    ? "text-blue-100"
                                                    : "text-slate-500"
                                            }
                                        `}
                                    >
                                        {group.name}
                                        {!group.isActive &&
                                            " - Nonaktif"}
                                    </p>
                                </button>
                            );
                        })}
                    </div>
                )}
            </section>

            {/* Daftar file */}

            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-col gap-4 border-b border-slate-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-slate-800">
                            {selectedGroup?.serviceName}
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Group:{" "}
                            {selectedGroup?.name}
                            {selectedFileOption &&
                                ` • Opsi: ${selectedFileOption.name}`}
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        {selectedService?.options?.length > 0 && (
                            <select
                                value={selectedFileOptionId}
                                onChange={(event) => {
                                    setSelectedFileOptionId(
                                        event.target.value
                                    );
                                    setPagination({
                                        current_page: 1,
                                        last_page: 1,
                                        total: 0
                                    });
                                }}
                                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {selectedService.options.map(
                                    (option) => (
                                        <option
                                            key={option.id}
                                            value={option.id}
                                        >
                                            {option.name}
                                        </option>
                                    )
                                )}
                            </select>
                        )}

                        <button
                            type="button"
                            onClick={openEditModal}
                            disabled={
                                !selectedService ||
                                loadingServices
                            }
                            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <Pencil size={16} />
                            Edit Layanan
                        </button>

                        <div className="rounded-xl bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
                            Total {pagination.total} file
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                        <Loader2
                            size={30}
                            className="mb-3 animate-spin"
                        />

                        Memuat file layanan...
                    </div>
                ) : error ? (
                    <div className="px-6 py-20 text-center">
                        <p className="font-semibold text-red-600">
                            {error}
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                fetchFiles(
                                    selectedGroupId,
                                    currentPage,
                                    selectedFileOptionId
                                )
                            }
                            className="mt-5 cursor-pointer rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
                        >
                            Coba Lagi
                        </button>
                    </div>
                ) : files.length === 0 ? (
                    <div className="px-6 py-20 text-center">
                        <FileText
                            size={46}
                            className="mx-auto mb-4 text-slate-400"
                        />

                        <p className="font-semibold text-slate-600">
                            Belum ada file pada layanan ini.
                        </p>

                        <button
                            type="button"
                            onClick={openUploadModal}
                            className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
                        >
                            <Upload size={18} />
                            Upload File
                        </button>
                    </div>
                ) : (
                    <>
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

                                            return (
                                                <tr
                                                    key={file.id}
                                                    className={`
                                                        border-t
                                                        border-slate-100
                                                        ${
                                                            index % 2 === 0
                                                                ? "bg-white"
                                                                : "bg-slate-50/50"
                                                        }
                                                    `}
                                                >
                                                    <td className="min-w-72 px-6 py-4 text-sm font-medium text-slate-700">
                                                        {
                                                            file.original_name
                                                        }
                                                    </td>

                                                    <td className="px-6 py-4 text-sm text-slate-700">
                                                        {file.user?.nama ??
                                                            "-"}
                                                    </td>

                                                    <td className="px-6 py-4 text-sm text-slate-700">
                                                        {file.mime_type ??
                                                            "-"}
                                                    </td>

                                                    <td className="px-6 py-4 text-sm text-slate-700">
                                                        {formatFileSize(
                                                            file.file_size
                                                        )}
                                                    </td>

                                                    <td className="min-w-56 px-6 py-4 text-sm text-slate-700">
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
                                                                    title="Lihat atau download"
                                                                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700 transition hover:bg-blue-200"
                                                                >
                                                                    <Download
                                                                        size={
                                                                            18
                                                                        }
                                                                    />
                                                                </a>
                                                            )}

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    openMoveModal(
                                                                        file
                                                                    )
                                                                }
                                                                disabled={
                                                                    moving
                                                                }
                                                                title="Pindahkan file"
                                                                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl bg-amber-100 text-amber-700 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-60"
                                                            >
                                                                <FolderInput
                                                                    size={18}
                                                                />
                                                            </button>

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        file
                                                                    )
                                                                }
                                                                disabled={
                                                                    deletingId ===
                                                                        file.id ||
                                                                    moving
                                                                }
                                                                title="Hapus file"
                                                                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl bg-red-100 text-red-700 transition hover:bg-red-200 disabled:cursor-not-allowed disabled:opacity-60"
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
                                            selectedGroupId,
                                            currentPage - 1,
                                            selectedFileOptionId
                                        )
                                    }
                                    disabled={
                                        currentPage <= 1
                                    }
                                    className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
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
                                            selectedGroupId,
                                            currentPage + 1,
                                            selectedFileOptionId
                                        )
                                    }
                                    disabled={
                                        currentPage >=
                                        lastPage
                                    }
                                    className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Berikutnya

                                    <ChevronRight
                                        size={18}
                                    />
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </section>

            {/* Modal edit layanan */}

            {editModalOpen && editForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
                    <div className="max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl">
                        <div className="flex items-center justify-between border-b border-slate-200 p-6">
                            <div>
                                <h2 className="text-xl font-bold text-slate-800">
                                    Edit Layanan
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    {selectedGroup?.name}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={closeEditModal}
                                disabled={savingService}
                                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form
                            onSubmit={handleSaveService}
                            className="max-h-[calc(92vh-88px)] overflow-y-auto p-6"
                        >
                            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                                <div>
                                    <label
                                        htmlFor="service-name"
                                        className="mb-2 block text-sm font-semibold text-slate-700"
                                    >
                                        Nama layanan
                                    </label>

                                    <input
                                        id="service-name"
                                        type="text"
                                        value={
                                            editForm.name
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            updateEditField(
                                                "name",
                                                event.target
                                                    .value
                                            )
                                        }
                                        disabled={
                                            savingService
                                        }
                                        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                                    />

                                    {getValidationText(
                                        "name"
                                    ) && (
                                        <p className="mt-2 text-sm font-semibold text-red-600">
                                            {getValidationText(
                                                "name"
                                            )}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="service-status"
                                        className="mb-2 block text-sm font-semibold text-slate-700"
                                    >
                                        Status layanan
                                    </label>

                                    <label className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-700">
                                        <input
                                            id="service-status"
                                            type="checkbox"
                                            checked={
                                                editForm.is_active
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                updateEditField(
                                                    "is_active",
                                                    event.target
                                                        .checked
                                                )
                                            }
                                            disabled={
                                                savingService
                                            }
                                            className="h-4 w-4"
                                        />
                                        Aktif
                                    </label>
                                </div>
                            </div>

                            <div className="mt-5">
                                <label
                                    htmlFor="service-description"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >
                                    Deskripsi layanan
                                </label>

                                <textarea
                                    id="service-description"
                                    value={
                                        editForm.description
                                    }
                                    onChange={(event) =>
                                        updateEditField(
                                            "description",
                                            event.target.value
                                        )
                                    }
                                    disabled={savingService}
                                    rows={3}
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                                />

                                {getValidationText(
                                    "description"
                                ) && (
                                    <p className="mt-2 text-sm font-semibold text-red-600">
                                        {getValidationText(
                                            "description"
                                        )}
                                    </p>
                                )}
                            </div>

                            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-800">
                                        Daftar Opsi
                                    </h3>
                                </div>

                                <button
                                    type="button"
                                    onClick={addOption}
                                    disabled={savingService}
                                    className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-slate-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <Plus size={16} />
                                    Tambah Opsi
                                </button>
                            </div>

                            {getValidationText(
                                "options"
                            ) && (
                                <p className="mt-3 text-sm font-semibold text-red-600">
                                    {getValidationText(
                                        "options"
                                    )}
                                </p>
                            )}

                            <div className="mt-4 space-y-4">
                                {editForm.options.map(
                                    (
                                        option,
                                        index
                                    ) => (
                                        <div
                                            key={
                                                option.id ??
                                                `new-${index}`
                                            }
                                            className="rounded-xl border border-slate-200 p-4"
                                        >
                                            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1fr_auto] lg:items-start">
                                                <div>
                                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                                        Nama opsi
                                                    </label>

                                                    <input
                                                        type="text"
                                                        value={
                                                            option.name
                                                        }
                                                        onChange={(
                                                            event
                                                        ) =>
                                                            updateOption(
                                                                index,
                                                                "name",
                                                                event
                                                                    .target
                                                                    .value
                                                            )
                                                        }
                                                        disabled={
                                                            savingService
                                                        }
                                                        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                                                    />

                                                    {getValidationText(
                                                        `options.${index}.name`
                                                    ) && (
                                                        <p className="mt-2 text-sm font-semibold text-red-600">
                                                            {getValidationText(
                                                                `options.${index}.name`
                                                            )}
                                                        </p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                                        Deskripsi opsi
                                                    </label>

                                                    <input
                                                        type="text"
                                                        value={
                                                            option.description
                                                        }
                                                        onChange={(
                                                            event
                                                        ) =>
                                                            updateOption(
                                                                index,
                                                                "description",
                                                                event
                                                                    .target
                                                                    .value
                                                            )
                                                        }
                                                        disabled={
                                                            savingService
                                                        }
                                                        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                                                    />
                                                </div>

                                                <div className="flex flex-wrap items-center gap-2 lg:pt-8">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            moveOption(
                                                                index,
                                                                -1
                                                            )
                                                        }
                                                        disabled={
                                                            savingService ||
                                                            index ===
                                                                0
                                                        }
                                                        title="Naikkan opsi"
                                                        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                                                    >
                                                        <ArrowUp
                                                            size={
                                                                16
                                                            }
                                                        />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            moveOption(
                                                                index,
                                                                1
                                                            )
                                                        }
                                                        disabled={
                                                            savingService ||
                                                            index ===
                                                                editForm
                                                                    .options
                                                                    .length -
                                                                    1
                                                        }
                                                        title="Turunkan opsi"
                                                        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                                                    >
                                                        <ArrowDown
                                                            size={
                                                                16
                                                            }
                                                        />
                                                    </button>

                                                    <label className="flex h-10 cursor-pointer items-center gap-2 rounded-xl border border-slate-200 px-3 text-sm text-slate-700">
                                                        <input
                                                            type="checkbox"
                                                            checked={
                                                                option.is_active
                                                            }
                                                            onChange={(
                                                                event
                                                            ) =>
                                                                updateOption(
                                                                    index,
                                                                    "is_active",
                                                                    event
                                                                        .target
                                                                        .checked
                                                                )
                                                            }
                                                            disabled={
                                                                savingService
                                                            }
                                                        />
                                                        Aktif
                                                    </label>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeOption(
                                                                index
                                                            )
                                                        }
                                                        disabled={
                                                            savingService
                                                        }
                                                        title="Hapus opsi"
                                                        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl bg-red-100 text-red-700 transition hover:bg-red-200 disabled:cursor-not-allowed disabled:opacity-60"
                                                    >
                                                        <Trash2
                                                            size={
                                                                16
                                                            }
                                                        />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                )}

                                {editForm.options.length ===
                                    0 && (
                                    <div className="rounded-xl border border-slate-200 px-4 py-8 text-center text-sm text-slate-500">
                                        Belum ada opsi.
                                    </div>
                                )}
                            </div>

                            <div className="mt-8 flex justify-end gap-3 border-t border-slate-200 pt-5">
                                <button
                                    type="button"
                                    onClick={closeEditModal}
                                    disabled={savingService}
                                    className="cursor-pointer rounded-xl border border-slate-200 px-5 py-3 text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    Batal
                                </button>

                                <button
                                    type="submit"
                                    disabled={savingService}
                                    className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {savingService ? (
                                        <Loader2
                                            size={18}
                                            className="animate-spin"
                                        />
                                    ) : (
                                        <Save size={18} />
                                    )}
                                    Simpan Perubahan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal upload */}

            {uploadModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
                    <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
                        <div className="flex items-center justify-between border-b border-slate-200 p-6">
                            <div>
                                <h2 className="text-xl font-bold text-slate-800">
                                    Upload File
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Layanan: {selectedGroup?.serviceName}
                                </p>

                                <p className="mt-1 text-sm text-slate-500">
                                    Opsi: {selectedFileOption?.name ?? "-"}
                                </p>

                                <p className="mt-1 text-sm text-slate-500">
                                    Group: {selectedGroup?.name}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={closeUploadModal}
                                disabled={uploading}
                                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
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
                                <div className="rounded-xl bg-slate-100 p-4">
                                    <p className="font-semibold text-slate-800">
                                        {
                                            selectedFile.name
                                        }
                                    </p>

                                    <p className="mt-1 text-sm text-slate-500">
                                        {formatFileSize(
                                            selectedFile.size
                                        )}
                                    </p>
                                </div>
                            )}

                            <p className="text-sm text-slate-500">
                                Maksimal ukuran file 10 MB.
                            </p>

                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={closeUploadModal}
                                    disabled={uploading}
                                    className="cursor-pointer rounded-xl border border-slate-200 px-5 py-3 text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    Batal
                                </button>

                                <button
                                    type="submit"
                                    disabled={
                                        uploading ||
                                        !selectedFile ||
                                        !selectedFileOptionId
                                    }
                                    className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
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

            {/* Modal pindahkan file */}

            {moveTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
                    <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
                        <div className="flex items-center justify-between border-b border-slate-200 p-6">
                            <div>
                                <h2 className="text-xl font-bold text-slate-800">
                                    Pindahkan File
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Pilih layanan tujuan file.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={closeMoveModal}
                                disabled={moving}
                                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form
                            onSubmit={handleMoveFile}
                            className="space-y-5 p-6"
                        >
                            <div className="rounded-xl bg-slate-100 p-4">
                                <p className="text-sm text-slate-500">
                                    File
                                </p>

                                <p className="mt-1 break-all font-semibold text-slate-800">
                                    {
                                        moveTarget.original_name
                                    }
                                </p>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Layanan asal
                                </label>

                                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700">
                                    {
                                        selectedGroup?.serviceName
                                    }{" "}
                                    (
                                    {
                                        selectedGroup?.name
                                    }
                                    )
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="target-group"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >
                                    Layanan tujuan
                                </label>

                                <select
                                    id="target-group"
                                    value={targetGroupId}
                                    onChange={(event) => {
                                        setTargetGroupId(
                                            event.target.value
                                        );
                                        setTargetOptionId("");
                                    }}
                                    disabled={moving}
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <option value="">
                                        Pilih layanan tujuan
                                    </option>

                                    {groups
                                        .filter(
                                            (group) =>
                                                Number(
                                                    group.id
                                                ) !==
                                                Number(
                                                    selectedGroupId
                                                )
                                        )
                                        .map(
                                            (group) => (
                                                <option
                                                    key={
                                                        group.id
                                                    }
                                                    value={
                                                        group.id
                                                    }
                                                >
                                                    {
                                                        group.serviceName
                                                    }{" "}
                                                    -{" "}
                                                    {
                                                        group.name
                                                    }
                                                </option>
                                            )
                                        )}
                                </select>
                            </div>

                            {targetService?.options?.length > 0 && (
                                <div>
                                    <label
                                        htmlFor="target-option"
                                        className="mb-2 block text-sm font-semibold text-slate-700"
                                    >
                                        Opsi tujuan
                                    </label>

                                    <select
                                        id="target-option"
                                        value={targetOptionId}
                                        onChange={(event) =>
                                            setTargetOptionId(
                                                event.target.value
                                            )
                                        }
                                        disabled={moving}
                                        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        <option value="">
                                            Pilih opsi tujuan
                                        </option>

                                        {targetService.options.map(
                                            (option) => (
                                                <option
                                                    key={option.id}
                                                    value={option.id}
                                                >
                                                    {option.name}
                                                </option>
                                            )
                                        )}
                                    </select>
                                </div>
                            )}

                            {targetGroup && (
                                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
                                    File akan dipindahkan dari{" "}
                                    <strong>
                                        {
                                            selectedGroup?.serviceName
                                        }
                                    </strong>{" "}
                                    ke{" "}
                                    <strong>
                                        {
                                            targetGroup.serviceName
                                        }
                                    </strong>
                                    .
                                </div>
                            )}

                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={closeMoveModal}
                                    disabled={moving}
                                    className="cursor-pointer rounded-xl border border-slate-200 px-5 py-3 text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    Batal
                                </button>

                                <button
                                    type="submit"
                                    disabled={
                                    moving ||
                                    !targetGroupId ||
                                    !targetOptionId
                                }
                                    className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-amber-500 px-5 py-3 font-semibold text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {moving ? (
                                        <Loader2
                                            size={18}
                                            className="animate-spin"
                                        />
                                    ) : (
                                        <FolderInput
                                            size={18}
                                        />
                                    )}

                                    {moving
                                        ? "Memindahkan..."
                                        : "Pindahkan"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
