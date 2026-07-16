import {
    useEffect,
    useState
} from "react";
import {
    Navigate,
    useParams,
    useNavigate
} from "react-router-dom";

import { me } from "../services/authService";
import { getUserGroupIds } from "../utils/groups";

export default function MenuPage() {

    const { id } = useParams();

    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(() => {
        const stored = localStorage.getItem("user");

        return stored ? JSON.parse(stored) : null;
    });
    const [loading, setLoading] = useState(true);

    const serviceGroupId = Math.ceil(Number(id) / 4);

    useEffect(() => {
        async function fetchUser() {
            try {
                const response = await me();
                const user = response.data.data ?? response.data.user;

                setCurrentUser(user);

                if (user) {
                    localStorage.setItem(
                        "user",
                        JSON.stringify(user)
                    );
                }
            } catch (error) {
                if (error.response?.status === 401) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");

                    navigate("/login", {
                        replace: true
                    });
                }
            } finally {
                setLoading(false);
            }
        }

        fetchUser();
    }, [navigate]);

    const userGroupIds = getUserGroupIds(currentUser);

    const canAccess =
        ["admin", "super_admin", "viewer"].includes(
            currentUser?.role
        ) ||
        (
            currentUser?.role === "user" &&
            userGroupIds.includes(serviceGroupId)
        );

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-100 text-slate-500">
                Memeriksa akses...
            </div>
        );
    }

    if (!canAccess) {
        return <Navigate to="/home" replace />;
    }

    return (

        <div className="min-h-screen bg-slate-100">

            <div className="max-w-5xl mx-auto p-8">

                <h1 className="text-3xl font-bold mb-6">
                    Menu {id}
                </h1>

                <div className="bg-white rounded-xl shadow p-6">

                    <p>
                        Ini adalah halaman Menu {id}
                    </p>

                </div>

                <button
                    onClick={() => navigate("/home")}
                    className="
                        mt-6
                        px-4
                        py-2
                        bg-blue-500
                        text-white
                        rounded-lg
                        hover:bg-blue-600
                        transition
                        duration-300
                        ease-in-out
                    "
                >
                    Kembali ke Home
                </button>

            </div>

        </div>

    );

}
