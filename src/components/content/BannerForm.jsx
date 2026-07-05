import { useState } from "react";
import {
    ImagePlus,
    Upload,
    X
} from "lucide-react";

import { uploadBanner } from "../../services/bannerService";

export default function BannerForm() {

    const [title, setTitle] = useState("");

    const [images, setImages] = useState([]);

    async function handleSubmit(e) {

        e.preventDefault();

        if (images.length === 0) {

            alert("Silakan pilih gambar.");

            return;

        }

        const formData = new FormData();

        formData.append("title", title);

        images.forEach((file) => {

            formData.append("images[]", file);

        });

        try {

            await uploadBanner(formData);

            alert("Banner berhasil ditambahkan.");

            window.location.reload();

        } catch (err) {

            console.log(err.response?.data);

        }

    }

    function removeImage(index) {

        setImages(images.filter((_, i) => i !== index));

    }

    return (

        <div
            className="
                bg-white
                rounded-3xl
                shadow-xl
                border
                border-slate-200
                p-8
                sticky
                top-28
            "
        >

            {/* Header */}

            <div className="mb-8">

                <div
                    className="
                        w-14
                        h-14
                        rounded-2xl
                        bg-blue-100
                        flex
                        items-center
                        justify-center
                        mb-4
                    "
                >

                    <ImagePlus
                        className="text-blue-600"
                        size={28}
                    />

                </div>

                <h2 className="text-2xl font-bold">

                    Upload Banner

                </h2>

                <p className="text-slate-500 mt-2">

                    Upload maksimal 5 banner untuk homepage.

                </p>

            </div>

            <form
                onSubmit={handleSubmit}
                className="space-y-6"
            >

                {/* Title */}

                <div>

                    <label className="font-medium">

                        Judul Banner

                    </label>

                    <input
                        type="text"
                        placeholder="Contoh : Banner Promo"
                        value={title}
                        onChange={(e) =>
                            setTitle(e.target.value)
                        }
                        className="
                            mt-2
                            w-full
                            rounded-xl
                            border
                            border-slate-200
                            px-4
                            py-3
                            outline-none
                            focus:ring-2
                            focus:ring-blue-500
                        "
                    />

                </div>

                {/* Upload */}

                <label
                    className="
                        block
                        border-2
                        border-dashed
                        border-slate-300
                        rounded-2xl
                        p-8
                        text-center
                        hover:border-blue-500
                        hover:bg-blue-50
                        transition
                        cursor-pointer
                    "
                >

                    <Upload
                        className="mx-auto text-blue-600"
                        size={42}
                    />

                    <h3 className="font-semibold mt-4">

                        Klik untuk memilih gambar

                    </h3>

                    <p className="text-sm text-slate-500 mt-2">

                        JPG, PNG atau WEBP

                    </p>

                    <input
                        type="file"
                        multiple
                        className="hidden"
                        onChange={(e) =>
                            setImages(
                                Array.from(e.target.files)
                            )
                        }
                    />

                </label>

                {/* Preview */}

                {

                    images.length > 0 && (

                        <div>

                            <div
                                className="
                                    flex
                                    justify-between
                                    items-center
                                    mb-4
                                "
                            >

                                <h4 className="font-semibold">

                                    Preview

                                </h4>

                                <span
                                    className="
                                        text-sm
                                        text-slate-500
                                    "
                                >

                                    {images.length} gambar dipilih

                                </span>

                            </div>

                            <div
                                className="
                                    grid
                                    grid-cols-2
                                    gap-3
                                "
                            >

                                {

                                    images.map((image, index) => (

                                        <div
                                            key={index}
                                            className="
                                                relative
                                                rounded-xl
                                                overflow-hidden
                                                border
                                            "
                                        >

                                            <img
                                                src={URL.createObjectURL(image)}
                                                alt=""
                                                className="
                                                    h-32
                                                    w-full
                                                    object-cover
                                                "
                                            />

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeImage(index)
                                                }
                                                className="
                                                    absolute
                                                    top-2
                                                    right-2
                                                    w-8
                                                    h-8
                                                    rounded-full
                                                    bg-red-500
                                                    text-white
                                                    flex
                                                    items-center
                                                    justify-center
                                                    hover:bg-red-600
                                                    cursor-pointer
                                                "
                                            >

                                                <X size={16} />

                                            </button>

                                        </div>

                                    ))

                                }

                            </div>

                        </div>

                    )

                }

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

                    Upload Banner

                </button>

            </form>

        </div>

    );

}