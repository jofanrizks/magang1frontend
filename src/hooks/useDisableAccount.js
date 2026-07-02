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

            // 3. Input OTP
            const { value: otp } = await Swal.fire({

                title: "Masukkan OTP",

                text: "Kode OTP telah dikirim ke WhatsApp Anda.",

                input: "text",

                inputPlaceholder: "Masukkan OTP",

                showCancelButton: true,

                confirmButtonText: "Disable",

                cancelButtonText: "Batal"

            });

            if (!otp) return;

            // 4. Disable akun
            const res = await disableAccount(otp);

            await Swal.fire({

                icon: "success",

                title: "Berhasil",

                text: res.data.message

            });

            logout();

        } catch (err) {

            console.error(err);

            Swal.fire({

                icon: "error",

                title: "Gagal",

                text:
                    err.response?.data?.message ||
                    "Terjadi kesalahan"

            });

        }

    }

    return {
        handleDisable
    };

}
