import { useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import {
    reactivateAccount,
    sendReactivateOtp
} from "../services/reactivateAccountService";

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

                    <p className="text-sm text-slate-600 mt-1">
                        {log.description || "-"}
                    </p>

                    <div className="mt-3 text-xs text-slate-500 space-y-1">
                        <p>{formatDate(log.created_at)}</p>

                        {log.ip_address && (
                            <p>IP: {log.ip_address}</p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function ReactivateAccount() {

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

            localStorage.removeItem("reactivate_nik");
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

                        <Link
                            to="/login"
                            className="
                                block
                                w-full
                                text-center
                                bg-blue-600
                                hover:bg-blue-700
                                text-white
                                p-3
                                rounded-xl
                                font-semibold
                            "
                        >
                            Kembali ke Login
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
