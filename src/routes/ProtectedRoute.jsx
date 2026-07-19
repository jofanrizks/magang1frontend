import { Navigate } from "react-router-dom";

export default function ProtectedRoute({
    children,
    role,
    roles
}) {
    const token =
        localStorage.getItem("token");

    let user = null;

    if (token) {
        try {
            user = JSON.parse(
                localStorage.getItem("user")
            );
        } catch (error) {
            console.error("Stored user data is invalid.", error);
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        }
    }

    const allowedRoles =
        roles ?? (role ? [role] : []);

    if (!token) {
        return (
            <Navigate
                to="/login"
                replace
            />
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

    const isChangePasswordPage =
        window.location.pathname === "/change-password-required";

    if (mustChangePassword && !isChangePasswordPage) {
        return (
            <Navigate
                to="/change-password-required"
                replace
            />
        );
    }

    if (!mustChangePassword && isChangePasswordPage) {
        return (
            <Navigate
                to={
                    ["super_admin", "admin"].includes(user.role)
                        ? "/dashboard"
                        : "/home"
                }
                replace
            />
        );
    }

    return children;
}
