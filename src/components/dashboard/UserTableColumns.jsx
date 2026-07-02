import Badge from "../ui/Badge";
import { MoreVertical } from "lucide-react";

export default function userTableColumns(openUser) {

    return [

        {
            key: "id",
            title: "ID",
            align: "center"
        },

        {
            key: "nama",
            title: "Nama",
            align: "center"
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
                            : user.sts === "disabled"
                            ? "red"
                            : "yellow"
                    }
                >

                    {user.sts}

                </Badge>

            )

        },

        {
            key: "approval",
            title: "Approval",
            align: "center",

            render: (user) => (

                <Badge
                    color={
                        user.approval === "approved"
                            ? "green"
                            : user.approval === "rejected"
                            ? "red"
                            : "yellow"
                    }
                >

                    {user.approval}

                </Badge>

            )

        },

        {
            key: "tgldaftar",
            title: "Tgl Daftar",
            align: "center",

            render: (user) =>
                user.tgldaftar
                    ? new Date(user.tgldaftar).toLocaleDateString("id-ID")
                    : "-"
        },

        {
            key: "tglapproval",
            title: "Tgl Approval",
            align: "center",

            render: (user) =>
                user.tglapproval
                    ? new Date(user.tglapproval).toLocaleDateString("id-ID")
                    : "-"
        },

        {
            key: "tgldisabled",
            title: "Tgl Disabled",
            align: "center",

            render: (user) =>
                user.tgldisabled
                    ? new Date(user.tgldisabled).toLocaleDateString("id-ID")
                    : "-"
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
                        w-9
                        h-9
                        rounded-lg
                        hover:bg-slate-200
                        transition
                        cursor-pointer
                    "
                >

                    <MoreVertical size={18} />

                </button>

            )

        }

    ];

}