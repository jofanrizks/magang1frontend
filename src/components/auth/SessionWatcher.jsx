import { useEffect } from "react";
import { me } from "../../services/authService";

export default function SessionWatcher() {
    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            return undefined;
        }

        let ignore = false;
        let checking = false;

        async function checkSession() {
            if (ignore || checking || !localStorage.getItem("token")) {
                return;
            }

            checking = true;

            try {
                const response = await me();
                const user =
                    response.data.data ??
                    response.data.user;

                if (!ignore && user) {
                    localStorage.setItem(
                        "user",
                        JSON.stringify(user)
                    );
                }
            } catch (error) {
                if (
                    !ignore &&
                    error.response?.status === 401
                ) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");

                    if (window.location.pathname !== "/login") {
                        window.location.replace("/login");
                    }
                }
            } finally {
                checking = false;
            }
        }

        function handleFocus() {
            void checkSession();
        }

        function handleVisibilityChange() {
            if (document.visibilityState === "visible") {
                void checkSession();
            }
        }

        void checkSession();

        const interval = window.setInterval(
            checkSession,
            30000
        );

        window.addEventListener("focus", handleFocus);
        document.addEventListener(
            "visibilitychange",
            handleVisibilityChange
        );

        return () => {
            ignore = true;
            window.clearInterval(interval);
            window.removeEventListener("focus", handleFocus);
            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange
            );
        };
    }, []);

    return null;
}
