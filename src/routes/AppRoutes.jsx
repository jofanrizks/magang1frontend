import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
// import PendingUser from "../pages/PendingUser";

import MainLayout from "../components/layout/MainLayout";

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>

                <Route path="/" element={<Login />} />

                <Route path="/register" element={<Register />} />

                <Route
                    path="/dashboard"
                    element={
                        <MainLayout>
                            <Dashboard />
                        </MainLayout>
                    }
                />

                {/* <Route
                    path="/pending-users"
                    element={
                        <MainLayout>
                            <PendingUser />
                        </MainLayout>
                    }
                /> */}

            </Routes>
        </BrowserRouter>
    );
}