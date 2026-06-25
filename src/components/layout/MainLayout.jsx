import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function MainLayout({
    children
}) {

    return (

        <div className="flex">

            <Sidebar />

            <div className="flex-1 bg-slate-100 min-h-screen">

                <Navbar />

                <div className="p-7">

                    {children}

                </div>

            </div>

        </div>

    );

}