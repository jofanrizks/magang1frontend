import { useState } from "react";

import Button from "../ui/Button";
import Input from "../ui/Input";
import Modal from "../ui/Modal";

const initialForm = {
    password: "",
    password_confirmation: ""
};

export default function ResetPasswordModal({
    open,
    user,
    loading,
    errors = {},
    onClose,
    onSubmit
}) {
    const [form, setForm] = useState(initialForm);
    const [localError, setLocalError] = useState("");

    function resetForm() {
        setForm(initialForm);
        setLocalError("");
    }

    function handleCloseModal() {
        if (loading) {
            return;
        }

        resetForm();
        onClose();
    }

    function handleSubmit(event) {
        event.preventDefault();

        if (form.password !== form.password_confirmation) {
            setLocalError("Konfirmasi password tidak sama.");
            return;
        }

        setLocalError("");
        onSubmit(form);
    }

    const passwordError =
        localError ||
        errors.password?.[0] ||
        errors.password_confirmation?.[0];

    return (
        <Modal
            open={open}
            title="Reset Password"
            description={`Reset password untuk ${user?.nama ?? "pengguna"}.`}
            onClose={handleCloseModal}
            closeDisabled={loading}
            footer={
                <>
                    <button
                        type="button"
                        onClick={handleCloseModal}
                        disabled={loading}
                        className="rounded-lg bg-slate-100 px-5 py-2 font-semibold text-slate-700 transition hover:bg-slate-200 disabled:opacity-60"
                    >
                        Batal
                    </button>

                    <Button
                        type="submit"
                        form="reset-password-modal"
                        disabled={loading}
                        className="w-auto rounded-lg px-5 py-2 disabled:opacity-60"
                    >
                        {loading ? "Memproses..." : "Reset Password"}
                    </Button>
                </>
            }
        >
            <form
                id="reset-password-modal"
                onSubmit={handleSubmit}
                className="space-y-4"
            >
                <Input
                    label="Password Baru"
                    type="password"
                    value={form.password}
                    onChange={(event) => setForm((previous) => ({
                        ...previous,
                        password: event.target.value
                    }))}
                    disabled={loading}
                    required
                />

                <Input
                    label="Konfirmasi Password"
                    type="password"
                    value={form.password_confirmation}
                    onChange={(event) => setForm((previous) => ({
                        ...previous,
                        password_confirmation: event.target.value
                    }))}
                    disabled={loading}
                    required
                />

                {passwordError && (
                    <p className="text-sm text-red-600">
                        {passwordError}
                    </p>
                )}
            </form>
        </Modal>
    );
}
