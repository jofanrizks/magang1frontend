import OtpForm from "../components/forms/OtpForm";

export default function Otp() {

    return (

        <div
            className="
                min-h-screen
                flex
                items-center
                justify-center
                bg-gray-100
            "
        >

            <div
                className="
                    bg-white
                    p-8
                    rounded-xl
                    shadow-md
                    w-full
                    max-w-md
                "
            >

                <h1
                    className="
                        text-2xl
                        font-bold
                        text-center
                        mb-6
                    "
                >
                    Verifikasi OTP
                </h1>

                <OtpForm />

            </div>

        </div>

    );

}