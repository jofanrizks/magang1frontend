import { useEffect, useState } from "react";
import api from "../api/axios";

import Table from "../components/ui/Table";
import Badge from "../components/ui/Badge";

export default function ApprovedUser() {

    const [users, setUsers] = useState([]);

    useEffect(() => {
        getUsers();
    }, []);

    async function getUsers() {

        try {

            const res = await api.get("/getApprovedUsers");

            setUsers(res.data.data);

        } catch (err) {

            console.log(err);

        }

    }

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

    ];

    return (

        <div className="space-y-8">

            {/* Header */}

            <div>

                <h1 className="text-3xl font-bold">
                    Approved User
                </h1>

                <p className="text-gray-500 mt-2">
                    Daftar seluruh pengguna yang telah disetujui
                </p>

            </div>

            {/* Table */}

            <Table
                // title="Data Approved User"
                // subtitle={`Total ${users.length} pengguna telah disetujui.`}
                columns={columns}
                data={users}
            />

        </div>

    );

}