import { BrowserRouter, Routes, Route }
from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Otp from "../pages/Otp";
import Dashboard from "../pages/Dashboard";
import Home from "../pages/Home";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import MenuPage from "../pages/MenuPages";

import PendingUser from "../pages/PendingUser";
import ApprovedUser from "../pages/ApprovedUser";

import MainLayout from "../components/layout/MainLayout";
import ProtectedRoute from "./ProtectedRoute";

export default function AppRoutes() {

    return (

        <BrowserRouter>

            <Routes>

                {/* Public */}

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/otp"
                    element={<Otp />}
                />

                <Route
                    path="/forgot-password"
                    element={<ForgotPassword />}
                />

                <Route
                    path="/reset-password"
                    element={<ResetPassword />}
                />

                

                {/* User */}

                <Route
                    path="/home"
                    element={
                        <ProtectedRoute
                            role="user"
                        >
                            <Home />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/menu/:id"
                    element={
                        <ProtectedRoute
                            role="user"
                        >
                            <MenuPage />
                        </ProtectedRoute>
                    }
                />

                {/* Admin */}

                <Route
                    element={
                        <ProtectedRoute
                            role="admin"
                        >
                            <MainLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route
                        path="/dashboard"
                        element={
                            <Dashboard />
                        }
                    />
                    <Route
                        path="/pending-users"
                        element={
                            <PendingUser />
                        }
                    />
                    <Route
                        path="/approved-users"
                        element={
                            <ApprovedUser />
                        }
                    />
                </Route>

            </Routes>

        </BrowserRouter>

    );

}