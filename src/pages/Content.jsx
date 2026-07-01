import BannerForm from "../components/content/BannerForm";
import BannerList from "../components/content/BannerList";

export default function Content() {

    return (

        <div className="space-y-8">

            {/* Header */}

            <div>

                <h1 className="text-3xl font-bold">
                    Content Management
                </h1>

                <p className="text-gray-500 mt-2">
                    Kelola banner dan konten yang ditampilkan pada halaman utama website.
                </p>

            </div>

            {/* Upload Banner */}

            <section className="bg-white rounded-2xl shadow-sm border p-6">

                <div className="mb-6">

                    <h2 className="text-xl font-semibold">
                        Upload Banner
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                        Tambahkan banner baru untuk ditampilkan pada halaman Home.
                    </p>

                </div>

                <BannerForm />

            </section>

            {/* Banner List */}

            <section className="bg-white rounded-2xl shadow-sm border p-6">

                <div className="mb-6">

                    <h2 className="text-xl font-semibold">
                        Daftar Banner
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                        Kelola banner yang telah diunggah.
                    </p>

                </div>

                <BannerList />

            </section>

        </div>

    );

}