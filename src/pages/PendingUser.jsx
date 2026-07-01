import { useEffect, useState } from "react";
import api from "../api/axios";
import Swal from "sweetalert2";

import Table from "../components/ui/Table";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";

export default function PendingUser() {

    const [users, setUsers] = useState([]);

    useEffect(() => {
        getUsers();
    }, []);

    async function getUsers() {

        try {

            const res = await api.get("/users/pending");

            setUsers(res.data.data);

        } catch (err) {

            console.log(err);

        }

    }

    async function approveUser(id) {

        try {

            await api.post(`/users/${id}/send-otp`);

            Swal.fire(
                "Berhasil",
                "OTP berhasil dikirim",
                "success"
            );

            getUsers();

        } catch (err) {

            console.log(err);

            Swal.fire(
                "Gagal",
                "Tidak bisa approve user",
                "error"
            );

        }

    }

    async function rejectUser(id) {

        const result = await Swal.fire({

            title: "Reject User?",
            text: "User akan ditolak",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya, Reject",
            cancelButtonText: "Batal"

        });

        if (!result.isConfirmed) return;

        try {

            await api.post(`/users/${id}/reject`);

            Swal.fire(
                "Berhasil",
                "User berhasil direject",
                "success"
            );

            getUsers();

        } catch (err) {

            console.log(err);

            Swal.fire(
                "Gagal",
                "Tidak bisa reject user",
                "error"
            );

        }

    }

    const columns = [

        {
            key: "nik",
            title: "NIK",
            align: "center"
        },

        {
            key: "nama",
            title: "Nama",
            align: "center"
        },

        {
            key: "jabatan",
            title: "Jabatan",
            align: "center"
        },

        {
            key: "telp",
            title: "No HP",
            align: "center"
        },

        {
            key: "instansi",
            title: "Instansi",
            align: "center"
        },

        {
            key: "approval",
            title: "Approval",
            align: "center",
            render: () => (
                <Badge color="yellow">
                    Pending
                </Badge>
            )
        },

        {
            key: "action",
            title: "Aksi",
            align: "center",
            render: (user) => (

                <div className="flex gap-2">

                    <Button
                        onClick={() => approveUser(user.id)}
                        className="
                            w-auto
                            bg-green-600
                            hover:bg-green-700
                            px-4
                            py-2
                            text-sm
                        "
                    >
                        Approve
                    </Button>

                    <Button
                        onClick={() => rejectUser(user.id)}
                        className="
                            w-auto
                            bg-red-600
                            hover:bg-red-700
                            px-4
                            py-2
                            text-sm
                        "
                    >
                        Reject
                    </Button>

                </div>

            )
        }

    ];

    return (

        <div className="space-y-8">

            <div>

                <h1 className="text-3xl font-bold">
                    Pending User
                </h1>

                <p className="text-gray-500 mt-2">
                    Daftar pengguna yang menunggu persetujuan admin
                </p>

            </div>

            <Table
                // title="Data Pending User"
                // subtitle={`Total ${users.length} pengguna menunggu persetujuan.`}
                columns={columns}
                data={users}
            />

        </div>

    );

}