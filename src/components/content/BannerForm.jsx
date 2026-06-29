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

        <div className="bg-white rounded-xl shadow p-6">

            <h2 className="text-xl font-semibold mb-5">

                Upload Banner

            </h2>

            <form
                onSubmit={handleSubmit}
                className="space-y-4"
            >

                <input
                    type="text"
                    placeholder="Judul Banner"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full border p-3 rounded-lg"
                />

                <input
                    type="file"
                    multiple
                    onChange={(e) => setImages(Array.from(e.target.files))}
                />

                <button
                    type="submit"
                    className="bg-green-600 text-white px-6 py-3 rounded-lg"
                >
                    Upload
                </button>

            </form>

        </div>

    );

}
