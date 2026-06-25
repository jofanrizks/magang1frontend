import { useEffect, useState } from "react";
import api from "../api/axios";
import Swal from "sweetalert2";

export default function PendingUser() {

    const [users, setUsers] = useState([]);

    useEffect(() => {

        getUsers();

    }, []);

    async function getUsers() {

        try {

            const res = await api.get(
                "/users/pending"
            );

            console.log(
                "DATA PENDING:",
                res.data
            );

            setUsers(
                res.data.data
            );

        } catch (err) {

            console.log(err);

        }

    }

    async function approveUser(id) {

        try {

            await api.post(
                `/users/${id}/send-otp`
            );

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

        if (!result.isConfirmed) {
            return;
        }

        try {

            await api.post(
                `/users/${id}/reject`
            );

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
        return (

        <div className="p-6">

            <h1 className="text-2xl font-bold mb-6">
                Pending User
            </h1>

            <div className="bg-white rounded-xl shadow overflow-hidden">

                <table className="w-full">

                    <thead>

                        <tr className="border-b bg-slate-100">

                            <th className="p-4 text-left">
                                NIK
                            </th>

                            <th className="p-4 text-left">
                                Nama
                            </th>

                            <th className="p-4 text-left">
                                Instansi
                            </th>

                            <th className="p-4 text-center">
                                Aksi
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {users.length > 0 ? (

                            users.map((user) => (

                                <tr
                                    key={user.id}
                                    className="border-b"
                                >

                                    <td className="p-4">
                                        {user.nik}
                                    </td>

                                    <td className="p-4">
                                        {user.nama}
                                    </td>

                                    <td className="p-4">
                                        {user.instansi}
                                    </td>

                                    <td className="p-4 text-center">

                                        <div className="flex justify-center gap-2">

                                            <button
                                                onClick={() =>
                                                    approveUser(user.id)
                                                }
                                                className="
                                                    bg-green-600
                                                    hover:bg-green-700
                                                    text-white
                                                    px-4
                                                    py-2
                                                    rounded-lg
                                                "
                                            >
                                                Approve
                                            </button>

                                            <button
                                                onClick={() =>
                                                    rejectUser(user.id)
                                                }
                                                className="
                                                    bg-red-600
                                                    hover:bg-red-700
                                                    text-white
                                                    px-4
                                                    py-2
                                                    rounded-lg
                                                "
                                            >
                                                Reject
                                            </button>

                                        </div>

                                    </td>

                                </tr>

                            ))

                        ) : (

                            <tr>

                                <td
                                    colSpan="4"
                                    className="
                                        p-6
                                        text-center
                                        text-gray-500
                                    "
                                >
                                    Tidak ada user pending
                                </td>

                            </tr>

                        )}

                    </tbody>

                </table>

            </div>

        </div>

    );

}