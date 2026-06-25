import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Otp from "../pages/Otp";
import Dashboard from "../pages/Dashboard";
import Home from "../pages/Home";

import MainLayout from "../components/layout/MainLayout";

export default function AppRoutes() {

    return (

        <BrowserRouter>

            <Routes>

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
                    element={<MainLayout />}
                >
                    <Route
                        path="/dashboard"
                        element={<Dashboard />}
                    />
                </Route>
                <Route
                    path="/home"
                    element={<Home />}
                />

            </Routes>

        </BrowserRouter>

    );

}