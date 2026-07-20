import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { me } from "../services/authService";

import {
    BadgeCheck,
    Ban,
    Briefcase,
    Building2,
    CalendarDays,
    CheckCircle2,
    Edit,
    History,
    IdCard,
    KeyRound,
    Phone,
    Send,
    Shield,
    Trash2,
    User,
    Users,
    X,
    XCircle,
    ArrowLeft
} from "lucide-react";

import Badge from "../components/ui/Badge";
import ActivityLog from "../components/dashboard/ActivityLog";
import useDisableAccount from "../hooks/useDisableAccount";
import { formatUserGroups } from "../utils/groups";

export default function Profile({
    fetchActivityLogs
}) {   

    const navigate = useNavigate();

    const [user, setUser] = useState(null);

    const { handleDisable } = useDisableAccount(logout);

    function logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    }
        

    useEffect(() => {

        async function loadProfile() {

            try {

                const res = await me();

                setUser(res.data.data);

            } catch (err) {

                console.log(err);

                navigate("/login");

            }

        }

        loadProfile();

    }, [navigate]);

    if (!user) return null;

    return (

        <div className="min-h-screen bg-slate-50">

            <div className="max-w-7xl mx-auto px-8 py-8">

                {/* Header */}
                <div
                    className="
                        sticky
                        top-0
                        flex
                        z-10
                        items-center
                        gap-4
                        mb-2
                        py-5
                        backdrop-blur-xs
                    "
                >

                    <button
                        onClick={() => navigate(-1)}
                        className="
                            w-11
                            h-11
                            rounded-xl
                            border
                            border-slate-200
                            bg-white
                            hover:bg-slate-100
                            transition
                            flex
                            items-center
                            justify-center
                            cursor-pointer
                        "
                    >
                        <ArrowLeft size={20}/>
                    </button>

                    <div>

                        <h1 className="text-4xl font-bold text-slate-800">
                            {user.nama}
                        </h1>

                        <p className="text-slate-500 mt-2">
                            Informasi akun dan riwayat aktivitas.
                        </p>

                    </div>

                </div>


                {/* Profile */}

                <div className="flex-1 overflow-y-auto bg-slate-50/70 ">
                                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                                        {/* Informasi utama */}
                
                                        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
                                            <SectionTitle
                                                icon={<User size={19} />}
                                                title="Informasi Pengguna"
                                            />
                
                                            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                                                <InfoItem
                                                    icon={<IdCard size={18} />}
                                                    label="NIK"
                                                    value={user.nik}
                                                />
                
                                                <InfoItem
                                                    icon={<Shield size={18} />}
                                                    label="Role"
                                                    value={formatRole(user.role)}
                                                />
                
                                                <InfoItem
                                                    icon={<Building2 size={18} />}
                                                    label="Instansi"
                                                    value={user.instansi}
                                                />
                
                                                <InfoItem
                                                    icon={<Briefcase size={18} />}
                                                    label="Jabatan"
                                                    value={user.jabatan}
                                                />
                
                                                <InfoItem
                                                    icon={<Phone size={18} />}
                                                    label="Nomor Telepon"
                                                    value={user.telp}
                                                />
                
                                                {user.role === "user" && (
                                                    <InfoItem
                                                        icon={<Users size={18} />}
                                                        label="Group"
                                                        value={formatUserGroups(user)}
                                                    />
                                                )}
                                            </div>
                                        </section>
                
                                        {/* Status akun */}
                
                                        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                            <SectionTitle
                                                icon={<Shield size={19} />}
                                                title="Status Akun"
                                            />
                
                                            <div className="mt-5 space-y-5">
                                                <StatusItem
                                                    icon={<Shield size={17} />}
                                                    label="Status"
                                                >
                                                    <Badge
                                                        color={statusColor(
                                                            user.sts
                                                        )}
                                                    >
                                                        {statusLabel(
                                                            user.sts
                                                        )}
                                                    </Badge>
                                                </StatusItem>
                
                                                <StatusItem
                                                    icon={
                                                        <BadgeCheck
                                                            size={17}
                                                        />
                                                    }
                                                    label="Approval"
                                                >
                                                    <Badge
                                                        color={approvalColor(
                                                            user.approval
                                                        )}
                                                    >
                                                        {approvalLabel(
                                                            user.approval
                                                        )}
                                                    </Badge>
                                                </StatusItem>
                
                                                <StatusItem
                                                    icon={
                                                        <KeyRound
                                                            size={17}
                                                        />
                                                    }
                                                    label="Wajib Ganti Password"
                                                >
                                                    <span className="font-semibold text-slate-700">
                                                        {user.must_change_password
                                                            ? "Ya"
                                                            : "Tidak"}
                                                    </span>
                                                </StatusItem>
                
                                                {Number(
                                                    user.login_attempt
                                                ) > 0 && (
                                                    <StatusItem
                                                        icon={
                                                            <KeyRound
                                                                size={17}
                                                            />
                                                        }
                                                        label="Percobaan Login"
                                                    >
                                                        <span className="font-semibold text-red-600">
                                                            {
                                                                user.login_attempt
                                                            }
                                                        </span>
                                                    </StatusItem>
                                                )}
                                            </div>
                                        </section>
                
                                        {/* Tanggal */}
                
                                        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-3">
                                            <SectionTitle
                                                icon={
                                                    <CalendarDays
                                                        size={19}
                                                    />
                                                }
                                                title="Informasi Waktu"
                                            />
                
                                            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
                                                <InfoItem
                                                    icon={
                                                        <CalendarDays
                                                            size={18}
                                                        />
                                                    }
                                                    label="Tanggal Daftar"
                                                    value={formatDateTime(
                                                        user.tgldaftar
                                                    )}
                                                />
                
                                                <InfoItem
                                                    icon={
                                                        <CalendarDays
                                                            size={18}
                                                        />
                                                    }
                                                    label="Tanggal Approval"
                                                    value={formatDateTime(
                                                        user.tglapproval
                                                    )}
                                                />
                
                                                <InfoItem
                                                    icon={
                                                        <CalendarDays
                                                            size={18}
                                                        />
                                                    }
                                                    label="Tanggal Dinonaktifkan"
                                                    value={formatDateTime(
                                                        user.tgldisabled
                                                    )}
                                                />
                                            </div>
                                        </section>
                
                                        {/* Alasan penolakan */}
                
                                        {user.approval === "rejected" &&
                                            user.rejection_reason && (
                                                <section className="rounded-2xl border border-orange-200 bg-orange-50 p-5 lg:col-span-3">
                                                    <div className="flex items-start gap-3">
                                                        <XCircle
                                                            size={20}
                                                            className="mt-0.5 shrink-0 text-orange-600"
                                                        />
                
                                                        <div>
                                                            <h3 className="font-semibold text-orange-800">
                                                                Alasan Penolakan
                                                            </h3>
                
                                                            <p className="mt-2 text-sm leading-6 text-orange-700">
                                                                {
                                                                    user.rejection_reason
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                </section>
                                            )}
                
                                        {/* Riwayat */}
                
                                        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-3">
                                            <ActivityLog
                                                logs={user.activity_logs ?? []}
                                                userId={user.id}
                                                fetchPage={fetchActivityLogs}
                                            />
                                        </section>
                                    </div>
                                </div>

                {/* Danger Zone */}

                <div className="flex justify-end mt-8">

                    <button
                        onClick={() => handleDisable(logout)}
                        className="
                            flex
                            items-center
                            gap-2
                            px-5
                            py-3
                            rounded-xl
                            border
                            bg-red-600
                            text-white
                            hover:bg-red-500
                            transition
                            cursor-pointer
                        "
                    >
                        <Ban size={18}/>
                        Disable Account
                    </button>

                </div>

            </div>

        </div>

    );

}

function SectionTitle({
    icon,
    title
}) {
    return (
        <div className="flex items-center gap-2 text-slate-800">
            <span className="text-blue-600">
                {icon}
            </span>

            <h3 className="font-semibold">
                {title}
            </h3>
        </div>
    );
}

function InfoItem({
    icon,
    label,
    value
}) {
    return (
        <div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
                {icon}
                <span>{label}</span>
            </div>

            <p className="mt-2 break-words font-semibold text-slate-800">
                {value || "-"}
            </p>
        </div>
    );
}

function StatusItem({
    icon,
    label,
    children
}) {
    return (
        <div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
                {icon}
                <span>{label}</span>
            </div>

            <div className="mt-2">
                {children}
            </div>
        </div>
    );
}

function initialName(name) {
    return name
        ? name
              .trim()
              .charAt(0)
              .toUpperCase()
        : "U";
}

function formatRole(role) {
    if (role === "super_admin") {
        return "Super Admin";
    }

    if (role === "admin") {
        return "Admin";
    }

    if (role === "viewer") {
        return "Viewer";
    }

    if (role === "user") {
        return "User";
    }

    return role ?? "-";
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
    if (approval === "pending") return "yellow";

    return "red";
}

function approvalLabel(approval) {
    if (approval === "approved") {
        return "Disetujui";
    }

    if (approval === "rejected") {
        return "Ditolak";
    }

    if (approval === "pending") {
        return "Pending";
    }

    return approval ?? "-";
}

function formatDateTime(value) {
    return value
        ? new Date(value).toLocaleString(
              "id-ID",
              {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit"
              }
          )
        : "-";
}