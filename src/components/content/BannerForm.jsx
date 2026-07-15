import { useState } from "react";
import {
    ImagePlus,
    Upload,
    X,
    Image,
} from "lucide-react";

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

        <div
            className="
                bg-white
                rounded-3xl
                border
                border-slate-200
                shadow-sm
                p-8
                sticky
                top-24
            "
        >

            {/* Header */}

            <div className="flex items-center gap-4 mb-8">

                <div
                    className="
                        w-14
                        h-14
                        rounded-2xl
                        bg-gradient-to-r
                        from-blue-600
                        to-cyan-500
                        text-white
                        flex
                        items-center
                        justify-center
                        shadow-lg
                    "
                >
                    <ImagePlus size={28} />
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-slate-800">
                        Upload Banner
                    </h2>

                    <p className="text-sm text-slate-500 mt-1">
                        Upload atau ganti banner homepage.
                    </p>
                </div>

            </div>

            <form
                onSubmit={handleSubmit}
                className="space-y-6"
            >

                {/* Slot */}

                <div>

                    <label className="block text-sm font-semibold mb-2 text-slate-700">
                        Slot Banner
                    </label>

                    <select
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="
                            w-full
                            rounded-2xl
                            border
                            border-slate-200
                            px-4
                            py-3
                            outline-none
                            transition
                            focus:ring-2
                            focus:ring-blue-500
                            focus:border-blue-500
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

                {/* Upload */}

                <div>

                    <label className="block text-sm font-semibold mb-3 text-slate-700">
                        Gambar Banner
                    </label>

                    <label
                        className="
                            flex
                            flex-col
                            items-center
                            justify-center
                            gap-3
                            border-2
                            border-dashed
                            border-slate-300
                            hover:border-blue-500
                            bg-slate-50
                            rounded-2xl
                            p-8
                            transition
                            cursor-pointer
                        "
                    >

                        <Upload
                            size={34}
                            className="text-blue-600"
                        />

                        <span className="font-medium text-slate-700">
                            Klik untuk memilih gambar
                        </span>

                        <span className="text-sm text-slate-500">
                            JPG, PNG maksimal 2 MB
                        </span>

                        <input
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={(e) =>
                                setImage(e.target.files[0])
                            }
                        />

                    </label>

                </div>

                {/* Preview */}

                {image && (

                    <div>

                        <label className="block text-sm font-semibold mb-3">
                            Preview
                        </label>

                        <div
                            className="
                                relative
                                rounded-2xl
                                overflow-hidden
                                border
                                border-slate-200
                            "
                        >

                            <img
                                src={URL.createObjectURL(image)}
                                alt="Preview"
                                className="
                                    w-full
                                    h-56
                                    object-cover
                                "
                            />

                            <button
                                type="button"
                                onClick={() => setImage(null)}
                                className="
                                    absolute
                                    top-3
                                    right-3
                                    w-10
                                    h-10
                                    rounded-full
                                    bg-red-500
                                    hover:bg-red-600
                                    text-white
                                    flex
                                    items-center
                                    justify-center
                                    transition
                                "
                            >

                                <X size={18} />

                            </button>

                        </div>

                    </div>

                )}

                {/* Submit */}

                <button
                    type="submit"
                    className="
                        w-full
                        bg-gradient-to-r
                        from-blue-600
                        to-cyan-500
                        hover:from-blue-700
                        hover:to-cyan-600
                        text-white
                        py-4
                        rounded-2xl
                        font-semibold
                        shadow-lg
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