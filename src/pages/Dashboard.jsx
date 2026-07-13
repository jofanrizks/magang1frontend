import { useEffect, useState } from "react";

import {
    getAllUsers,
    getUserLog,
    disableUser,
    enableUser
} from "../services/userService";

import Table from "../components/ui/Table";

import DashboardStats from "../components/dashboard/DashboardStats";
import dashboardStats from "../utils/dashboardStats";

import userTableColumns from "../components/dashboard/UserTableColumns";

import UserDetailModal from "../components/dashboard/UserDetailModal";

export default function Dashboard() {

    const [users, setUsers] = useState([]);

    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {

        fetchUsers();

    }, []);


    async function handleDisable(id) {

        try {
            await disableUser(id);
            await fetchUsers();
            const res = await getUserLog(id);
            setSelectedUser({...res.data.data});
        } catch (err) {
            console.log(err);
        }
    }
    async function handleEnable(id) {
        try {
            await enableUser(id);
            await fetchUsers();
            const res = await getUserLog(id);
            setSelectedUser({...res.data.data});
        } catch (err) {
            console.log(err);
        }
    }

    async function fetchUsers() {
        try {
            const res = await getAllUsers();
            setUsers(res.data.data);
        } catch (err) {
            console.log(err);
        }
    }

    async function openUser(user) {
        try {
            const res = await getUserLog(user.id);
            setSelectedUser(res.data.data);
        } catch (err) {
            console.log(err);
        }
    }

    function closeUser() {
        setSelectedUser(null);
    }
    const stats = dashboardStats(users);
    const columns = userTableColumns(openUser);

    return (
        <div className="space-y-8">

            <div>
                <h1 className="text-3xl font-bold">
                    Dashboard Admin
                </h1>

                <p className="text-gray-500 mt-2">
                    Monitoring dan pengelolaan seluruh pengguna sistem.
                </p>
            </div>

            <DashboardStats stats={stats} />

            <Table
                title="Data User"
                subtitle="Seluruh data pengguna yang terdaftar"
                columns={columns}
                data={users}
                search
                searchPlaceHolder="Cari Data"
            />

            <UserDetailModal
                user={selectedUser}
                onClose={closeUser}
                onDisable={handleDisable}
                onEnable={handleEnable}
            />

        </div>

    );

}