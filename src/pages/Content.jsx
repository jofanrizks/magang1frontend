import BannerForm from "../components/content/BannerForm";
import BannerList from "../components/content/BannerList";

export default function Content() {

    return (

        <div className="space-y-8">

            <div>

                <h1 className="text-4xl font-bold">
                    Content Management
                </h1>

                <p className="text-slate-500 mt-2">
                    Kelola tampilan aplikasi
                </p>

            </div>


            <BannerForm />

            <BannerList />

        </div>

    );

}
