import Badge from "../ui/Badge";
import { MoreVertical } from "lucide-react";

export default function userTableColumns(openUser) {

    return [

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
            align: "center",

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
            align: "center",

            render: (user) =>
                new Date(
                    user.tgldaftar
                ).toLocaleDateString("id-ID")

        },

        {
            key: "detail",
            title: "",
            align: "center",

            render: (user) => (
                <button
                    onClick={() => openUser(user)}
                    className="
                        inline-flex
                        items-center
                        justify-center
                        rounded-lg
                        w-9
                        h-9
                        hover:bg-slate-300
                        hover:text-slate-600
                        transition
                        cursor-pointer
                        mx-auto
                    "   
                >
                    <MoreVertical size={20}/>
                </button>
            )

        }

    ];

}