import { useEffect, useState } from "react";

import Table from "../components/ui/Table";
import { getApprovedUsers } from "../services/userService";

export default function ApprovedUser() {

    const [users, setUsers] = useState([]);

    useEffect(() => {
        getUsers();
    }, []);

    async function getUsers() {

        try {

            const res = await getApprovedUsers();
            const payload = res.data.data;

            setUsers(payload.data ?? payload);

        } catch (err) {

            console.log(err);

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
