import {
    X,
    LogOut,
    Building2,
    Phone,
    Briefcase,
    UserX
} from "lucide-react";

export default function UserDrawer({

    open,
    onClose,
    user,
    logout,
    onDisable

}) {

    return (

        <>

            {/* Overlay */}

            <div
                onClick={onClose}
                className={`
                    fixed
                    inset-0
                    bg-black/40
                    transition
                    z-40
                    ${open
                        ? "opacity-100 visible"
                        : "opacity-0 invisible"}
                `}
            />

            {/* Drawer */}

            <aside
                className={`
                    fixed
                    top-0
                    right-0
                    h-screen
                    w-96
                    bg-white
                    shadow-2xl
                    z-50
                    transition-all
                    duration-300
                    ${
                        open
                            ? "translate-x-0"
                            : "translate-x-full"
                    }
                `}
            >

                {/* Header */}

                <div className="flex items-center justify-between p-6 border-b">

                    <h2 className="font-bold text-xl">
                        Profil
                    </h2>

                    <button
                        onClick={onClose}
                        className="
                            p-2
                            rounded-full
                            hover:bg-slate-200
                            transition
                            cursor-pointer
                        "
                    >

                        <X />
                    </button>

                </div>

                {/* Avatar */}

                <div className="flex flex-col items-center py-8">

                    <div
                        className="
                            w-24
                            h-24
                            rounded-full
                            bg-blue-600
                            text-white
                            text-4xl
                            flex
                            items-center
                            justify-center
                            font-bold
                        "
                    >
                        {user?.nama?.charAt(0)}
                    </div>

                    <h3 className="mt-5 text-xl font-bold">
                        {user?.nama}
                    </h3>

                    <p className="text-slate-500">
                        {user?.nik}
                    </p>

                </div>

                {/* Informasi */}

                <div className="px-6 space-y-5">

                    <div className="flex gap-4">
                        <Briefcase />

                        <div>
                            <p className="text-sm text-slate-400">
                                Jabatan
                            </p>

                            <p>{user?.jabatan}</p>
                        </div>

                    </div>

                    <div className="flex gap-4">

                        <Building2 />

                        <div>

                            <p className="text-sm text-slate-400">
                                Instansi
                            </p>

                            <p>{user?.instansi}</p>

                        </div>

                    </div>

                    <div className="flex gap-4">

                        <Phone />

                        <div>

                            <p className="text-sm text-slate-400">
                                Nomor HP
                            </p>

                            <p>{user?.telp}</p>

                        </div>

                    </div>

                </div>

                {/* Footer */}

                <div className="absolute bottom-0 w-full p-6 space-y-3">

                    <button
                        onClick={logout}
                        className="
                            w-full
                            py-3
                            rounded-xl
                            bg-orange-500
                            hover:bg-orange-600
                            text-white
                            flex
                            items-center
                            justify-center
                            gap-2
                            transition
                            cursor-pointer
                        "
                    >

                        <UserX size={18} />

                        Disable Account

                    </button>

                </div>

            </aside>

        </>

    );

}