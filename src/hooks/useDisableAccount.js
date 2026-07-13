import Swal from "sweetalert2";
import {
    sendDisableOtp,
    disableAccount
} from "../services/userService";

export default function useDisableAccount(logout) {

    async function handleDisable() {

        try {

            // 1. Input password
            const { value: password } = await Swal.fire({
                title: "Konfirmasi Password",
                text: "Masukkan password Anda",
                input: "password",
                inputPlaceholder: "Password",
                inputAttributes: {
                    autocapitalize: "off",
                    autocorrect: "off"
                },
                showCancelButton: true,
                confirmButtonText: "Lanjut",
                cancelButtonText: "Batal"
            });

            if (!password) return;

            // 2. Kirim OTP
            await sendDisableOtp(password);

            // 3. Input OTP — pakai loop supaya bisa retry kalau salah
            while (true) {

                const { value: otp, isDismissed } = await Swal.fire({
                    title: "Masukkan OTP",
                    text: "Kode OTP telah dikirim ke WhatsApp Anda.",
                    input: "text",
                    inputPlaceholder: "Masukkan OTP",
                    showCancelButton: true,
                    confirmButtonText: "Disable",
                    cancelButtonText: "Batal",
                    allowOutsideClick: false
                });

                // user klik Batal
                if (isDismissed) return;
                if (!otp) continue;

                try {

                    // 4. Disable akun
                    const res = await disableAccount(otp);

                    // FIX 1: res sudah res.data dari userService, jadi langsung res.message
                    await Swal.fire({
                        icon: "success",
                        title: "Berhasil",
                        text: res.message ?? "Akun berhasil dinonaktifkan."
                    });

                    // FIX 2 & 3: logout dipanggil setelah Swal, bukan onSuccess
                    logout();
                    return

                } catch (err) {

                    // OTP salah → backend return 400, tampilkan warning dan loop lagi
                    await Swal.fire({
                        icon: "warning",
                        title: "OTP Salah",
                        text: err?.response?.data?.message ?? "OTP tidak valid atau sudah expired.",
                        confirmButtonText: "Coba Lagi"
                    });

                    // loop while(true) akan ulang dari input OTP lagi
                }
            }

        } catch (err) {

            // Error di luar OTP — misal password salah atau send OTP gagal
            Swal.fire({
                icon: "error",
                title: "Gagal",
                text: err?.response?.data?.message ?? "Terjadi kesalahan."
            });

        }

    }

    return { handleDisable };
}