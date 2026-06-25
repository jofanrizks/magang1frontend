import { useEffect, useState } from "react";
import api from "../api/axios";

export default function ApprovedUser() {

    const [users, setUsers] = useState([]);

    useEffect(() => {
        getUsers();
    }, []);

    async function getUsers() {

        const res = await api.get(
            "/approved-users"
        );

        setUsers(res.data);

    }

    return (

        <div className="p-6">

            <h1 className="text-2xl font-bold mb-6">
                Approved User
            </h1>

            <div className="bg-white rounded-xl shadow">

                <table className="w-full">

                    <thead>

                        <tr className="border-b">

                            <th className="p-4">
                                NIK
                            </th>

                            <th className="p-4">
                                Nama
                            </th>

                            <th className="p-4">
                                Instansi
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {users.map((user) => (

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

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>

    );

}