import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";
import { useNavigate } from "react-router-dom";
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
    if (bytes < 1024) return `${bytes} B`;

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
    const fileInputRef = useRef(null);

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

    const subtitle = useMemo(() => {
        if (!group?.name) return "Group belum tersedia";
        return `Group: ${group.name}`;
    }, [group]);

    const serviceName = useMemo(() => {
        const serviceNumber =
            currentUser?.group_id ??
            group?.id;

        if (!serviceNumber) return "Layanan";

        return `Layanan ${serviceNumber}`;
    }, [currentUser?.group_id, group]);

    const handleUnauthorized = useCallback((err) => {
        if (err.response?.status !== 401) return false;

        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return true;
    }, [navigate]);

    const fetchCurrentUser = useCallback(async () => {
        try {
            const response = await me();
            const user = response.data.data ?? response.data.user;

            if (user) {
                setCurrentUser(user);
                localStorage.setItem("user", JSON.stringify(user));
            }
        } catch (err) {
            handleUnauthorized(err);
        }
    }, [handleUnauthorized]);

    const fetchFiles = useCallback(async (page) => {
        setLoading(true);
        setError("");

        try {
            const response = await getGroupFiles(page);
            const payload = response.data.data;
            const fileData = payload?.files;

            setGroup(payload?.group ?? null);
            setFiles(fileData?.data ?? []);
            setPagination({
                current_page: fileData?.current_page ?? 1,
                last_page: fileData?.last_page ?? 1,
                total: fileData?.total ?? 0
            });
        } catch (err) {
            if (handleUnauthorized(err)) return;

            setError(
                getErrorMessage(
                    err,
                    "Gagal mengambil data file group."
                )
            );
        } finally {
            setLoading(false);
        }
    }, [handleUnauthorized]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchCurrentUser();
        fetchFiles(1);
    }, [fetchCurrentUser, fetchFiles]);

    function closeModal() {
        if (uploading) return;

        setModalOpen(false);
        setSelectedFile(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
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

        if (!selectedFile) {
            Swal.fire({
                icon: "warning",
                title: "Pilih file",
                text: "Silakan pilih file yang ingin diunggah."
            });
            return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile);

        setUploading(true);

        try {
            await uploadGroupFile(formData);

            await Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: "File berhasil diunggah."
            });

            closeModal();
            fetchFiles(currentPage);
        } catch (err) {
            if (handleUnauthorized(err)) return;

            Swal.fire({
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
        const result = await Swal.fire({
            icon: "warning",
            title: "Hapus file?",
            text: `File ${file.original_name} akan dihapus.`,
            showCancelButton: true,
            confirmButtonText: "Hapus",
            cancelButtonText: "Batal",
            confirmButtonColor: "#dc2626"
        });

        if (!result.isConfirmed) return;

        setDeletingId(file.id);

        try {
            await deleteGroupFile(file.id);

            await Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: "File berhasil dihapus."
            });

            const nextPage =
                files.length === 1 && currentPage > 1
                    ? currentPage - 1
                    : currentPage;

            fetchFiles(nextPage);
        } catch (err) {
            if (handleUnauthorized(err)) return;

            Swal.fire({
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

            <main className="max-w-7xl mx-auto px-6 pt-28 pb-12">
                <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 mb-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate(-1)}
                                className="w-11 h-11 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition flex items-center justify-center cursor-pointer"
                            >
                                <ArrowLeft size={20} />
                            </button>

                            <div>
                                <h1 className="text-3xl font-bold text-slate-800">
                                    File Group
                                </h1>

                                <p className="text-slate-500 mt-1">
                                    {subtitle}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                            <div className="text-sm font-semibold text-blue-700 bg-blue-50 px-4 py-3 rounded-xl">
                                {serviceName}
                            </div>

                            <div className="text-sm text-slate-500 bg-slate-100 px-4 py-3 rounded-xl">
                                Maksimal ukuran file 10 MB
                            </div>

                            <button
                                onClick={() => setModalOpen(true)}
                                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold transition cursor-pointer"
                            >
                                <Upload size={18} />
                                Upload File
                            </button>
                        </div>
                    </div>
                </section>

                {loading ? (
                    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm py-16 flex flex-col items-center justify-center text-slate-500">
                        <Loader2 className="animate-spin mb-3" size={28} />
                        Memuat data file...
                    </div>
                ) : error ? (
                    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm py-16 px-6 text-center">
                        <p className="text-red-600 font-semibold">
                            {error}
                        </p>

                        <button
                            onClick={() => fetchFiles(currentPage)}
                            className="mt-5 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold transition cursor-pointer"
                        >
                            Coba Lagi
                        </button>
                    </div>
                ) : files.length === 0 ? (
                    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm py-16 px-6 text-center">
                        <FileText
                            size={44}
                            className="mx-auto text-slate-400 mb-4"
                        />

                        <p className="text-slate-600 font-semibold">
                            Belum ada file pada group ini.
                        </p>

                        <button
                            onClick={() => setModalOpen(true)}
                            className="mt-5 inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold transition cursor-pointer"
                        >
                            <Upload size={18} />
                            Upload File
                        </button>
                    </div>
                ) : (
                    <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-semibold text-slate-800">
                                    Daftar File
                                </h2>

                                <p className="text-sm text-slate-500 mt-1">
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
                                    {files.map((file, index) => {
                                        const fileUrl = getFileUrl(file.file_path);
                                        const canDelete =
                                            file.user_id === currentUser?.id;

                                        return (
                                            <tr
                                                key={file.id}
                                                className={`
                                                    border-t border-slate-100 hover:bg-blue-50 transition-colors
                                                    ${index % 2 === 0 ? "bg-white" : "bg-slate-50/40"}
                                                `}
                                            >
                                                <td className="px-6 py-4 text-sm text-slate-700 font-medium min-w-64">
                                                    {file.original_name}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-700">
                                                    {file.user?.nama || "-"}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-700">
                                                    {file.mime_type || "-"}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-700">
                                                    {formatFileSize(file.file_size)}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-700 min-w-52">
                                                    {formatDate(file.created_at)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-center gap-2">
                                                        {fileUrl && (
                                                            <a
                                                                href={fileUrl}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 hover:bg-blue-200 transition flex items-center justify-center"
                                                                title="Lihat atau download"
                                                            >
                                                                <Download size={18} />
                                                            </a>
                                                        )}

                                                        {canDelete && (
                                                            <button
                                                                onClick={() => handleDelete(file)}
                                                                disabled={deletingId === file.id}
                                                                className="w-10 h-10 rounded-xl bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-60 transition flex items-center justify-center cursor-pointer"
                                                                title="Hapus file"
                                                            >
                                                                {deletingId === file.id ? (
                                                                    <Loader2
                                                                        size={18}
                                                                        className="animate-spin"
                                                                    />
                                                                ) : (
                                                                    <Trash2 size={18} />
                                                                )}
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        <div className="px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <p className="text-sm text-slate-500">
                                Halaman {currentPage} dari {lastPage}
                            </p>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => fetchFiles(currentPage - 1)}
                                    disabled={currentPage <= 1}
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-slate-700 disabled:opacity-50 hover:bg-slate-100 transition cursor-pointer"
                                >
                                    <ChevronLeft size={18} />
                                    Sebelumnya
                                </button>

                                <button
                                    onClick={() => fetchFiles(currentPage + 1)}
                                    disabled={currentPage >= lastPage}
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-slate-700 disabled:opacity-50 hover:bg-slate-100 transition cursor-pointer"
                                >
                                    Berikutnya
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    </section>
                )}
            </main>

            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
                        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-slate-800">
                                    Upload File
                                </h2>

                                <p className="text-sm text-slate-500 mt-1">
                                    Maksimal ukuran file 10 MB
                                </p>
                            </div>

                            <button
                                onClick={closeModal}
                                disabled={uploading}
                                className="w-10 h-10 rounded-xl hover:bg-slate-100 transition flex items-center justify-center cursor-pointer disabled:opacity-60"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleUpload} className="p-6 space-y-5">
                            <input
                                ref={fileInputRef}
                                type="file"
                                onChange={handleFileChange}
                                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />

                            {selectedFile && (
                                <div className="rounded-xl bg-slate-100 p-4 text-sm text-slate-600">
                                    <p className="font-semibold text-slate-800">
                                        {selectedFile.name}
                                    </p>
                                    <p className="mt-1">
                                        {formatFileSize(selectedFile.size)}
                                    </p>
                                </div>
                            )}

                            <div className="flex items-center justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    disabled={uploading}
                                    className="px-5 py-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 transition cursor-pointer disabled:opacity-60"
                                >
                                    Batal
                                </button>

                                <button
                                    type="submit"
                                    disabled={uploading || !selectedFile}
                                    className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white px-5 py-3 rounded-xl font-semibold transition cursor-pointer"
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
