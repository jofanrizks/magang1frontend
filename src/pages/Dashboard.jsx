import { useEffect, useState } from "react";
import { getAllUsers } from "../services/userService";

import Table from "../components/ui/Table";
import StatCard from "../components/ui/StatCard";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Swal from "sweetalert2";
import api from "../api/axios";

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

    // Statistik Dashboard
    const stats = {

        total: users.length,

        pending: users.filter(
            user => user.approval === "Pending"
        ).length,

        approved: users.filter(
            user => user.approval === "approved"
        ).length,

        aktif: users.filter(
            user => user.sts === "aktif"
        ).length

    };

    // Kolom Table
    const columns = [

        {
            key: "nik",
            title: "NIK"
        },

        {
            key: "nama",
            title: "Nama"
        },

        {
            key: "jabatan",
            title: "Jabatan"
        },

        {
            key: "telp",
            title: "No HP"
        },

        {
            key: "instansi",
            title: "Instansi"
        },

        {
            key: "approval",
            title: "Approval",
            render: (user) => (

                <Badge
                    color={
                        user.approval === "pending"
                            ? "yellow"
                            : "green"
                    }
                >
                    {user.approval}
                </Badge>

            )
        },

        {
            key: "sts",
            title: "Status",
            render: (user) => (

                <Badge
                    color={
                        user.sts === "aktif"
                            ? "green"
                            : "red"
                    }
                >
                    {user.sts}
                </Badge>

            )
        },

        {
            key: "tgldaftar",
            title: "Tgl Daftar",
            render: (user) => 
                
                new Date(user.tgldaftar).toLocaleDateString("id-ID")
        },

        {
            key: "action",
            title: "Disable",
            render: (user) => (
        
                <Button
                    onClick={() => toggleUser(user)}
                    className={
                        user.sts === "aktif"
                            ? "bg-red-600 hover:bg-red-700 w-auto px-4 py-2 text-sm"
                            : "bg-green-600 hover:bg-green-700 w-auto px-4 py-2 text-sm"
                    }
                >
                    {user.sts === "aktif"
                        ? "Disable"
                        : "Enable"}
                </Button>
        
            )
        }

    ];

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

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

                <StatCard
                    title="Total User"
                    value={stats.total}
                    description="Seluruh pengguna sistem"
                    textColor="text-blue-600"
                />

                <StatCard
                    title="Pending"
                    value={stats.pending}
                    description="Menunggu persetujuan"
                    textColor="text-yellow-500"
                />

                <StatCard
                    title="Approved"
                    value={stats.approved}
                    description="Sudah disetujui"
                    textColor="text-green-600"
                />

                <StatCard
                    title="User Aktif"
                    value={stats.aktif}
                    description="Sedang aktif"
                    textColor="text-slate-700"
                />

            </div>

            {/* Data User */}

            <Table
                title="Data User"
                subtitle="Seluruh data pengguna yang terdaftar"
                columns={columns}
                data={users}
                search
                searchPlaceHolder="Cari User"
            />

        </div>

    );

}