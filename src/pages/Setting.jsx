import BannerForm from "../components/content/BannerForm";
import BannerList from "../components/content/BannerList";

export default function Setting() {

    return (

        <div className="max-w-6xl mx-auto space-y-8">

            <div>

                <h1 className="text-3xl font-bold">
                    Setting
                </h1>

                <p className="text-slate-500 mt-2">
                    Kelola banner yang ditampilkan pada halaman utama website.
                </p>

            </div>

            <div className="grid lg:grid-cols-3 gap-8">

                <div className="lg:col-span-1">

                    <BannerForm />

                </div>

                <div className="lg:col-span-2">

                    <BannerList />

                </div>

            </div>

        </div>

    );

}