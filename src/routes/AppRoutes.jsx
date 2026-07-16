import { BrowserRouter, Routes, Route, Navigate }
from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Otp from "../pages/Otp";
import Dashboard from "../pages/Dashboard";
import Home from "../pages/Home";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import GroupFiles from "../pages/GroupFiles";
import ReactivateAccount from "../pages/ReactivateAccount";
import ChangeRequiredPassword from "../pages/ChangeRequiredPassword";

import PendingUser from "../pages/PendingUser";
import ApprovedUser from "../pages/ApprovedUser";

import MainLayout from "../components/layout/MainLayout";
import ProtectedRoute from "./ProtectedRoute";

import MenuPage from "../pages/MenuPage";
import Setting from "../pages/Setting";

import ManageServices from "../pages/ManageServices";
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

                <Route
                    path="/reactivate-account"
                    element={<ReactivateAccount />}
                />

                <Route
                    path="/change-password-required"
                    element={
                        <ProtectedRoute>
                            <ChangeRequiredPassword />
                        </ProtectedRoute>
                    }
                />

                

                {/* User */}

                <Route 
                    path="/"
                    element={<Navigate to="/home" replace/>}
                    />

                <Route
                    path="/home"
                    element={<Home />}
                />

                <Route
                    path="/menu/:id"
                    element={
                        <ProtectedRoute>
                            <MenuPage />
                        </ProtectedRoute>
                    }
                />
                
                <Route
                    path="/group-files"
                    element={
                        <ProtectedRoute>
                            <GroupFiles />
                        </ProtectedRoute>
                    }
                />
                {/* Admin */}

                <Route
                    element={
                        <ProtectedRoute
                            roles={["super_admin", "admin"]}
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
                    <Route
                        path="/manage-services"
                        element={
                            <ManageServices />
                        }
                    />
                     <Route
                        path="/setting"
                        element={
                            <Setting />
                        }
                    />

                   
                    
                
                </Route>

            </Routes>

        </BrowserRouter>

    );

}
