import { useState } from "react";
import { uploadBanner } from "../../services/bannerService";

export default function BannerForm() {

    const [title, setTitle] = useState("");
    const [image, setImage] = useState(null);

    async function handleSubmit(e) {

        e.preventDefault();

        if (!title || !image) {
            alert("Lengkapi data terlebih dahulu.");
            return;
        }

        const formData = new FormData();

        formData.append("title", title);
        formData.append("images[]", image);

        try {

            await uploadBanner(formData);

            alert("Banner berhasil diperbarui.");

            window.location.reload();

        } catch (err) {

            console.log(err.response?.data);

        }

    }

    return (

        <div className="bg-white rounded-3xl border shadow-sm p-8 sticky top-24">

            <div className="flex items-center gap-4 mb-8">

        
                <div>

                    <h2 className="text-2xl font-bold">

                        Upload Banner

                    </h2>

                    <p className="text-sm text-slate-500">

                        Upload atau ganti banner homepage.

                    </p>

                </div>

            </div>

            <form
                onSubmit={handleSubmit}
                className="space-y-6"
            >

                <div>

                    <label className="block text-sm font-medium mb-2">

                        Slot Banner

                    </label>

                    <select
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
                    >

                        <option value="">
                            Pilih Slot Banner
                        </option>

                        <option value="Banner 1">
                            Banner 1
                        </option>

                        <option value="Banner 2">
                            Banner 2
                        </option>

                        <option value="Banner 3">
                            Banner 3
                        </option>

                        <option value="Banner 4">
                            Banner 4
                        </option>

                        <option value="Banner 5">
                            Banner 5
                        </option>

                    </select>

                </div>

                <div>

                    <label className="block text-sm font-medium mb-2">

                        Gambar Banner

                    </label>

                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImage(e.target.files[0])}
                        className="
                            w-full
                            border-2
                            border-dashed
                            border-slate-300
                            rounded-xl
                            p-4
                            cursor-pointer
                        "
                    />

                </div>

                <button
                    type="submit"
                    className="
                        w-full
                        bg-blue-600
                        hover:bg-blue-700
                        text-white
                        font-semibold
                        py-3
                        rounded-xl
                        transition
                        cursor-pointer
                    "
                >

                    Simpan Banner

                </button>

            </form>

        </div>

    );

}