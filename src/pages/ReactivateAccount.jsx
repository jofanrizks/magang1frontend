import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import {
    reactivateAccount,
    sendReactivateOtp
} from "../services/reactivateAccountService";

function formatDate(date) {
    if (!date) return "-";

    const formatted = new Intl.DateTimeFormat("id-ID", {
        timeZone: "Asia/Jakarta",
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    }).format(new Date(date));

    return formatted.includes("WIB")
        ? formatted
        : `${formatted} WIB`;
}

function ActivityLog({ logs }) {
    if (!logs || logs.length === 0) {
        return (
            <p className="text-sm text-slate-500">
                Belum ada aktivitas akun.
            </p>
        );
    }

    return (
        <div className="space-y-3">
            {logs.map((log, index) => (
                <div
                    key={log.id || index}
                    className="
                        rounded-xl
                        border
                        border-slate-200
                        bg-slate-50
                        p-4
                    "
                >
                    <p className="font-semibold text-slate-800">
                        {log.activity || "-"}
                    </p>

                    <p className="mt-1 text-sm text-slate-600">
                        {log.description || "-"}
                    </p>

                    <div
                        className="
                            mt-4
                            grid
                            grid-cols-1
                            sm:grid-cols-2
                            gap-3
                            text-sm
                        "
                    >
                        <div>
                            <p className="text-xs text-slate-400">
                                IP Address
                            </p>

                            <p className="font-medium text-slate-700">
                                {log.ip_address || "-"}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs text-slate-400">
                                Browser
                            </p>

                            <p className="font-medium text-slate-700">
                                {log.browser || "-"}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs text-slate-400">
                                Perangkat
                            </p>

                            <p className="font-medium text-slate-700">
                                {log.device_type || "-"}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs text-slate-400">
                                Sistem Operasi
                            </p>

                            <p className="font-medium text-slate-700">
                                {log.operating_system || "-"}
                            </p>
                        </div>
                    </div>

                    <div className="mt-4">
                        <details
                            className="
                                rounded-lg
                                border
                                border-slate-200
                                bg-white
                                px-3
                                py-2
                            "
                        >
                            <summary
                                className="
                                    cursor-pointer
                                    text-xs
                                    font-medium
                                    text-slate-600
                                "
                            >
                                Lihat User-Agent
                            </summary>

                            <p
                                className="
                                    mt-2
                                    break-all
                                    text-xs
                                    leading-relaxed
                                    text-slate-500
                                "
                            >
                                {log.user_agent || "-"}
                            </p>
                        </details>
                    </div>

                    <p className="mt-3 text-xs text-slate-500">
                        {formatDate(log.created_at)}
                    </p>
                </div>
            ))}
        </div>
    );
}
export default function ReactivateAccount() {

    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [nik, setNik] = useState(
        localStorage.getItem("reactivate_nik") || ""
    );
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [activityLogs, setActivityLogs] = useState(null);

    async function handleSendOtp(e) {
        e.preventDefault();
        setLoading(true);

        try {
            await sendReactivateOtp(nik);

            localStorage.setItem(
                "reactivate_nik",
                nik
            );

            await Swal.fire(
                "Berhasil",
                "OTP reaktivasi berhasil dikirim.",
                "success"
            );

            setStep(2);
        } catch (err) {
            Swal.fire(
                "Gagal",
                err.response?.data?.message ||
                "Gagal mengirim OTP reaktivasi.",
                "error"
            );
        } finally {
            setLoading(false);
        }
    }

    async function handleReactivate(e) {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await reactivateAccount({
                nik,
                code
            });

            const payload = response.data.data;

            setActivityLogs(payload?.activity_logs ?? []);

            await Swal.fire(
                "Berhasil",
                response.data.message ||
                "Akun berhasil diaktifkan kembali.",
                "success"
            );
        } catch (err) {
            Swal.fire(
                "Gagal",
                err.response?.data?.message ||
                "OTP salah atau sudah kedaluwarsa.",
                "error"
            );
        } finally {
            setLoading(false);
        }
    }

    function goToForgotPassword() {
        navigate("/forgot-password", {
            state: {
                nik,
                source: "reactivate-account"
            }
        });

        localStorage.removeItem("reactivate_nik");
    }

    function goToLogin() {
        localStorage.removeItem("reactivate_nik");
        navigate("/login");
    }

    return (
        <div
            className="
                min-h-screen
                bg-slate-100
                flex
                items-center
                justify-center
                px-4
                py-10
            "
        >
            <div
                className="
                    bg-white
                    shadow-xl
                    rounded-3xl
                    p-8
                    w-full
                    max-w-[460px]
                "
            >
                <h1 className="text-3xl font-bold mb-3">
                    Reactivate Account
                </h1>

                <p className="text-sm text-slate-500 mb-7">
                    Aktifkan kembali akun dengan verifikasi OTP.
                </p>

                {activityLogs === null ? (
                    <form
                        onSubmit={
                            step === 1
                                ? handleSendOtp
                                : handleReactivate
                        }
                        className="space-y-4"
                    >
                        <Input
                            label="NIK"
                            value={nik}
                            disabled={step === 2}
                            onChange={(e) =>
                                setNik(e.target.value)
                            }
                        />

                        {step === 2 && (
                            <Input
                                label="Kode OTP"
                                value={code}
                                maxLength={6}
                                onChange={(e) =>
                                    setCode(
                                        e.target.value.replace(/\D/g, "")
                                    )
                                }
                            />
                        )}

                        <Button
                            type="submit"
                            disabled={loading}
                            className={loading ? "opacity-70" : ""}
                        >
                            {loading
                                ? "Memproses..."
                                : step === 1
                                ? "Kirim OTP"
                                : "Aktifkan Akun"
                            }
                        </Button>
                    </form>
                ) : (
                    <div className="space-y-5">
                        <div
                            className="
                                rounded-xl
                                bg-green-50
                                text-green-700
                                p-4
                                font-medium
                            "
                        >
                            Akun berhasil diaktifkan kembali.
                        </div>

                        <div>
                            <h2 className="font-semibold text-slate-800 mb-3">
                                Activity Log
                            </h2>

                            <ActivityLog logs={activityLogs} />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <Button
                                type="button"
                                onClick={goToForgotPassword}
                            >
                                Ganti Password
                            </Button>

                            <Button
                                type="button"
                                onClick={goToLogin}
                                className="
                                    bg-slate-700
                                    hover:bg-slate-800
                                "
                            >
                                Kembali ke Login
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
