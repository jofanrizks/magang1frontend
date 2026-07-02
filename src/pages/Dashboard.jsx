import { useEffect, useState } from "react";
import { getAllUsers } from "../services/adminService";

import api from "../api/axios";

import Table from "../components/ui/Table";

import DashboardStats from "../components/dashboard/DashboardStats";
import dashboardStats from "../utils/dashboardStats";

import userTableColumns from "../components/dashboard/UserTableColumns";

import useUserModal from "../hooks/userModal";
import UserDetailModal from "../components/dashboard/UserDetailModal";

export default function Dashboard() {

    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    async function fetchUsers() {

        try {

            const res = await getAllUsers();

            setUsers(res.data.data);

        } catch (err) {

            console.log(err);

        }

    }

    async function toggleUser(user) {

        try {
    
            if (user.sts === "aktif") {
    
                await api.post(`/users/${user.id}/disable`);
    
            } else {
    
                await api.post(`/users/${user.id}/enable`);
    
            }
    
            fetchUsers();
            closeUser();
    
        } catch (err) {
    
            console.log(err);
    
        }
    
    }

    // Modal User
    const {selectedUser, openUser, closeUser} = useUserModal();
    
    // Statistik Dashboard
    const stats = dashboardStats(users);

    // Kolom Table
    const columns = userTableColumns(openUser);


    return (

        <div className="space-y-8">

            {/* Header */}

            <div>

                <h1 className="text-3xl font-bold">
                    Dashboard Admin
                </h1>

                <p className="text-gray-500 mt-2">
                    Monitoring dan pengelolaan seluruh pengguna sistem.
                </p>

            </div>

            {/* Report */}
            <DashboardStats stats={stats} />

            {/* Data User */}

            <Table
                title="Data User"
                subtitle="Seluruh data pengguna yang terdaftar"
                columns={columns}
                data={users}
                search
                searchPlaceHolder="Cari User"
            />

            <UserDetailModal 
                user={selectedUser}
                onClose={closeUser}
                onToggleStatus={toggleUser}
            />

        </div>

    );

}