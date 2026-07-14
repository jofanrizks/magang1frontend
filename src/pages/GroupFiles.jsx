import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";
import {
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
    Trash2,
    Upload,
    X
} from "lucide-react";

import Navbar from "../components/layout/Navbar";
import { API_ORIGIN } from "../config/api";
import {
    deleteGroupFile,
    getGroupFiles,
    uploadGroupFile
} from "../services/groupFileService";
import { me } from "../services/authService";

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
    const [searchParams] = useSearchParams();
    const fileInputRef = useRef(null);

    const requestedGroupId = searchParams.get("group_id");

    const [group, setGroup] = useState(null);
    const [files, setFiles] = useState([]);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        total: 0
    });

    const [currentUser, setCurrentUser] = useState(null);
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

    /*
    |--------------------------------------------------------------------------
    | Hak akses upload
    |--------------------------------------------------------------------------
    |
    | Hanya role user yang boleh upload.
    | Viewer hanya membaca file.
    |
    */

    const canUpload = isUser;

    const subtitle = useMemo(() => {
        if (group?.name) {
            return `Group: ${group.name}`;
        }

        if (requestedGroupId) {
            return `Group: group-${requestedGroupId}`;
        }

        return "Group belum tersedia";
    }, [
        group,
        requestedGroupId
    ]);

    const serviceName = useMemo(() => {
        /*
        |--------------------------------------------------------------------------
        | Penentuan layanan
        |--------------------------------------------------------------------------
        |
        | Viewer mengambil layanan dari query parameter.
        | User mengambil layanan dari group miliknya.
        |
        */

        const serviceNumber =
            requestedGroupId ??
            currentUser?.group_id ??
            group?.id;

        if (!serviceNumber) {
            return "Layanan";
        }

        return `Layanan ${serviceNumber}`;
    }, [
        requestedGroupId,
        currentUser?.group_id,
        group?.id
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

    const fetchCurrentUser = useCallback(async () => {
        try {
            const response = await me();

            const user =
                response.data.data ??
                response.data.user;

            if (user) {
                setCurrentUser(user);

                localStorage.setItem(
                    "user",
                    JSON.stringify(user)
                );
            }
        } catch (err) {
            handleUnauthorized(err);
        }
    }, [handleUnauthorized]);

    const fetchFiles = useCallback(
        async (page = 1) => {
            setLoading(true);
            setError("");

            try {
                /*
                |--------------------------------------------------------------------------
                | Fetch file
                |--------------------------------------------------------------------------
                |
                | Untuk Viewer:
                | GET /group-files?page=1&group_id=2
                |
                | Untuk User:
                | Backend tetap menggunakan group_id user login.
                |
                */

                const response = await getGroupFiles(
                    page,
                    requestedGroupId
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
            requestedGroupId
        ]
    );

    useEffect(() => {
        fetchCurrentUser();
        fetchFiles(1);
    }, [
        fetchCurrentUser,
        fetchFiles
    ]);

    function closeModal() {
        if (uploading) return;

        setModalOpen(false);
        setSelectedFile(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }

    function openUploadModal() {
        /*
        |--------------------------------------------------------------------------
        | Pengaman frontend
        |--------------------------------------------------------------------------
        |
        | Viewer tidak boleh membuka modal upload.
        |
        */

        if (!canUpload) {
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

        /*
        |--------------------------------------------------------------------------
        | Viewer tidak boleh upload
        |--------------------------------------------------------------------------
        */

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

        setUploading(true);

        try {
            await uploadGroupFile(formData);

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
        /*
        |--------------------------------------------------------------------------
        | Pengaman delete
        |--------------------------------------------------------------------------
        |
        | Hanya User pemilik file yang boleh delete.
        |
        */

        const canDelete =
            currentUser?.role === "user" &&
            Number(file.user_id) ===
                Number(currentUser?.id);

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
            await deleteGroupFile(file.id);

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

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <main className="mx-auto max-w-7xl px-6 pb-12 pt-28">
                <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-slate-50 transition hover:bg-slate-100"
                                title="Kembali"
                            >
                                <ArrowLeft size={20} />
                            </button>

                            <div>
                                <h1 className="text-3xl font-bold text-slate-800">
                                    File Group
                                </h1>

                                <p className="mt-1 text-slate-500">
                                    {subtitle}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                            <div className="rounded-xl bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700">
                                {serviceName}
                            </div>

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

                                            /*
                                            |--------------------------------------------------------------------------
                                            | Delete permission
                                            |--------------------------------------------------------------------------
                                            */

                                            const canDelete =
                                                currentUser?.role ===
                                                    "user" &&
                                                Number(
                                                    file.user_id
                                                ) ===
                                                    Number(
                                                        currentUser?.id
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
                                    Maksimal ukuran file 10 MB
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