import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { me } from "../services/authService";

export default function ProtectedRoute({
    children,
    role,
    roles
}) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("token");

    const allowedRoles = roles ?? (role ? [role] : []);

    useEffect(() => {
        if (!token) {
            setLoading(false);
            return;
        }

        async function fetchUser() {
            try {
                const response = await me();
                const currentUser = response.data.data ?? response.data.user;

                setUser(currentUser);

                if (currentUser) {
                    localStorage.setItem(
                        "user",
                        JSON.stringify(currentUser)
                    );
                }
            } catch (err) {
                if (err.response?.status === 401) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                }

                setUser(null);
            } finally {
                setLoading(false);
            }
        }

        fetchUser();
    }, [token]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-slate-500">
                Memeriksa akses...
            </div>
        );
    }

    if (!token || !user) {

        return (
            <Navigate
                to="/login"
                replace
            />
        );

    }

    if (
        allowedRoles.length > 0 &&
        !allowedRoles.includes(user?.role)
    ) {

        return (
            <Navigate
                to="/home"
                replace
            />
        );

    }

    const mustChangePassword =
        user.must_change_password === true ||
        user.must_change_password === 1 ||
        user.must_change_password === "1";
        
    const isChangePasswrodPage = window.location.pathname === "/change-password-required";

    if (mustChangePassword && !isChangePasswrodPage) {
        return (
            <Navigate
                to="/change-password-required"
                replace
            />
        );
    }

    if (!mustChangePassword && isChangePasswrodPage) {
        return (
            <Navigate
                to={
                    ["super_admin", "admin"].includes(user?.role)
                        ? "/dashboard"
                        : "/home"
                }
                replace
            />
        );
    }

    return children;
}