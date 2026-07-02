import StatCard from "../ui/StatCard";

export default function DashboardStats({ stats }) {

    return (

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

            <StatCard
                title="Total User"
                value={stats.total}
                description="Seluruh pengguna"
                textColor="text-blue-600"
            />

            <StatCard
                title="User Aktif"
                value={stats.aktif}
                description="Akun aktif"
                textColor="text-green-600"
            />

            <StatCard
                title="User Disabled"
                value={stats.disabled}
                description="Akun dinonaktifkan"
                textColor="text-red-600"
            />

            <StatCard
                title="Pending Approval"
                value={stats.pending}
                description="Menunggu persetujuan"
                textColor="text-yellow-500"
            />

        </div>

    );

}