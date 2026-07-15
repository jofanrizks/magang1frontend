import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";
import Swal from "sweetalert2";
import {
    ChevronLeft,
    ChevronRight,
    Download,
    FileText,
    FolderCog,
    FolderInput,
    Loader2,
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

export default function ManageServices() {
    const fileInputRef = useRef(null);

    const groups = [
        {
            id: 1,
            name: "group-1",
            serviceName: "Layanan 1"
        },
        {
            id: 2,
            name: "group-2",
            serviceName: "Layanan 2"
        },
        {
            id: 3,
            name: "group-3",
            serviceName: "Layanan 3"
        },
        {
            id: 4,
            name: "group-4",
            serviceName: "Layanan 4"
        },
        {
            id: 5,
            name: "group-5",
            serviceName: "Layanan 5"
        }
    ];

    const [selectedGroupId, setSelectedGroupId] =
        useState(1);

    const [files, setFiles] =
        useState([]);

    const [pagination, setPagination] =
        useState({
            current_page: 1,
            last_page: 1,
            total: 0
        });

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
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

    const [moving, setMoving] =
        useState(false);

    const currentPage =
        pagination.current_page || 1;

    const lastPage =
        pagination.last_page || 1;

    const selectedGroup = useMemo(() => {
        return groups.find(
            (group) =>
                Number(group.id) ===
                Number(selectedGroupId)
        );
    }, [selectedGroupId]);

    const targetGroup = useMemo(() => {
        return groups.find(
            (group) =>
                Number(group.id) ===
                Number(targetGroupId)
        );
    }, [targetGroupId]);

    const fetchFiles = useCallback(
        async (
            groupId,
            page = 1
        ) => {
            if (!groupId) {
                return;
            }

            setLoading(true);
            setError("");

            try {
                const response =
                    await getGroupFiles(
                        page,
                        groupId
                    );

                const payload =
                    response.data.data;

                const fileData =
                    payload?.files;

                setFiles(
                    fileData?.data ?? []
                );

                setPagination({
                    current_page:
                        fileData?.current_page ?? 1,

                    last_page:
                        fileData?.last_page ?? 1,

                    total:
                        fileData?.total ?? 0
                });
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
        fetchFiles(
            selectedGroupId,
            1
        );
    }, [
        selectedGroupId,
        fetchFiles
    ]);

    function handleSelectGroup(groupId) {
        if (
            Number(groupId) ===
            Number(selectedGroupId)
        ) {
            return;
        }

        setSelectedGroupId(groupId);
        setFiles([]);

        setPagination({
            current_page: 1,
            last_page: 1,
            total: 0
        });
    }

    function openUploadModal() {
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
                currentPage
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

        if (
            Number(targetGroupId) ===
            Number(selectedGroupId)
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
                targetGroupId
            );

            await Swal.fire({
                icon: "success",
                title: "Berhasil",
                text:
                    `File berhasil dipindahkan ke ${targetGroup?.serviceName}.`
            });

            setMoveTarget(null);
            setTargetGroupId("");

            const nextPage =
                files.length === 1 &&
                currentPage > 1
                    ? currentPage - 1
                    : currentPage;

            await fetchFiles(
                selectedGroupId,
                nextPage
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
                nextPage
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

                <button
                    type="button"
                    onClick={openUploadModal}
                    className="
                        inline-flex
                        cursor-pointer
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        bg-blue-600
                        px-5
                        py-3
                        font-semibold
                        text-white
                        transition
                        hover:bg-blue-700
                    "
                >
                    <Upload size={18} />
                    Upload File
                </button>
            </div>

            {/* Pilihan layanan */}

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-800">
                    Pilih Layanan
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                    Pilih layanan yang ingin dikelola.
                </p>

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
                                </p>
                            </button>
                        );
                    })}
                </div>
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
                        </p>
                    </div>

                    <div className="rounded-xl bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
                        Total {pagination.total} file
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
                                    currentPage
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
                                            currentPage - 1
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
                                            currentPage + 1
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
                                    Upload ke{" "}
                                    {
                                        selectedGroup?.serviceName
                                    }{" "}
                                    (
                                    {
                                        selectedGroup?.name
                                    }
                                    )
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
                                        !selectedFile
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
                                    onChange={(event) =>
                                        setTargetGroupId(
                                            event.target.value
                                        )
                                    }
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
                                        !targetGroupId
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