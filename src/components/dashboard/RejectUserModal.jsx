import { useEffect, useState } from "react";

import Button from "../ui/Button";
import Modal from "../ui/Modal";

export default function RejectUserModal({
    open,
    user,
    loading,
    errors = {},
    onClose,
    onSubmit
}) {
    const [reason, setReason] = useState("");
    const [localError, setLocalError] = useState("");

    useEffect(() => {
        if (!open) {
            setReason("");
            setLocalError("");
        }
    }, [open]);

    function handleSubmit(event) {
        event.preventDefault();

        const trimmedReason = reason.trim();

        if (!trimmedReason) {
            setLocalError("Alasan penolakan wajib diisi.");
            return;
        }

        if (trimmedReason.length > 1000) {
            setLocalError("Alasan penolakan maksimal 1000 karakter.");
            return;
        }

        setLocalError("");
        onSubmit({ reason: trimmedReason });
    }

    const reasonError =
        localError ||
        errors.reason?.[0] ||
        errors.reason;

    return (
        <Modal
            open={open}
            title="Reject Pengguna"
            description={`Tolak pengajuan ${user?.nama ?? "pengguna"}.`}
            onClose={onClose}
            closeDisabled={loading}
            footer={
                <>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="rounded-lg bg-slate-100 px-5 py-2 font-semibold text-slate-700 transition hover:bg-slate-200 disabled:opacity-60"
                    >
                        Batal
                    </button>

                    <Button
                        type="submit"
                        form="reject-user-modal"
                        disabled={loading}
                        className="w-auto rounded-lg bg-red-600 px-5 py-2 hover:bg-red-700 disabled:opacity-60"
                    >
                        {loading ? "Memproses..." : "Reject"}
                    </Button>
                </>
            }
        >
            <form
                id="reject-user-modal"
                onSubmit={handleSubmit}
                className="space-y-4"
            >
                <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                    Alasan penolakan akan dikirim kepada pengguna melalui WhatsApp.
                </div>

                <div className="space-y-2">
                    <label className="font-medium">
                        Alasan Penolakan
                    </label>

                    <textarea
                        value={reason}
                        onChange={(event) => setReason(event.target.value)}
                        disabled={loading}
                        maxLength={1000}
                        rows={5}
                        className="w-full resize-none rounded-xl border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
                    />

                    <div className="flex items-center justify-between gap-4">
                        {reasonError ? (
                            <p className="text-sm text-red-600">
                                {reasonError}
                            </p>
                        ) : (
                            <span />
                        )}

                        <span className="text-xs text-slate-400">
                            {reason.length}/1000
                        </span>
                    </div>
                </div>
            </form>
        </Modal>
    );
}