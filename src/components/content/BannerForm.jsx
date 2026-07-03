import { useState } from "react";
import { uploadBanner } from "../../services/bannerService";

export default function BannerForm() {

    const [title, setTitle] = useState("");

    const [images, setImages] = useState([]);

    async function handleSubmit(e) {

        e.preventDefault();

        const formData = new FormData();

        formData.append("title", title);

        images.forEach((file) => {

            formData.append("images[]", file);

        });

        try {

            await uploadBanner(formData);

            alert("Banner berhasil ditambahkan");

            window.location.reload();

        } catch (err) {

            console.log(err.response?.data);

        }

    }

    return (

        <div className="bg-white rounded-2xl border shadow-sm p-6 sticky top-24">

            <h2 className="text-xl font-bold">

                Upload Banner

            </h2>

            <p className="text-sm text-slate-500 mt-1 mb-6">

                Tambahkan banner baru untuk halaman Home.

            </p>

            <form
                onSubmit={handleSubmit}
                className="space-y-5"
            >

                <input
                    type="text"
                    placeholder="Judul Banner"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="
                        w-full
                        rounded-xl
                        border
                        border-slate-300
                        px-4
                        py-3
                        outline-none
                        focus:ring-2
                        focus:ring-blue-500
                    "
                />

                <input
                    type="file"
                    multiple
                    onChange={(e) => setImages(Array.from(e.target.files))}
                    className="
                        w-full
                        rounded-xl
                        border
                        border-dashed
                        border-slate-300
                        p-4
                        cursor-pointer
                    "
                />

                <button
                    type="submit"
                    className="
                        w-full
                        bg-blue-600
                        hover:bg-blue-700
                        text-white
                        font-medium
                        py-3
                        rounded-xl
                        transition
                        cursor-pointer
                    "
                >

                    Upload Banner

                </button>

            </form>

        </div>

    );

}