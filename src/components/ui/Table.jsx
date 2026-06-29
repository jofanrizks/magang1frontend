import { useMemo, useState } from "react";

export default function Table({
    title,
    subtitle,
    columns,
    data,
    search = false,
    searchPlaceHolder = "Cari data..."
}) {

    const [keyword, setKeyword] = useState("");

    const filteredData = useMemo(() => {

        if (!keyword) return data;

        return data.filter((item) =>

            columns.some((column) => {

                if (column.render) return false;

                const value = item[column.key];

                return String(value ?? "")
                    .toLowerCase()
                    .includes(keyword.toLowerCase());

            })

        );

    }, [keyword, data, columns]);

    return (

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">

            {(title || subtitle || search) && (

                <div className="px-6 py-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                    <div>

                        {title && (

                            <h2 className="text-xl font-semibold text-slate-800">
                                {title}
                            </h2>

                        )}

                        {subtitle && (

                            <p className="text-sm text-slate-500 mt-1">
                                {subtitle}
                            </p>

                        )}

                    </div>

                    {search && (

                        <input
                            type="text"
                            placeholder={searchPlaceHolder}
                            value={keyword}
                            onChange={(e) =>
                                setKeyword(e.target.value)
                            }
                            className="
                                w-full
                                md:w-80
                                rounded-lg
                                border
                                border-slate-300
                                px-4
                                py-2
                                text-sm
                                focus:outline-none
                                focus:ring-2
                                focus:ring-blue-500
                                focus:border-blue-500
                            "
                        />

                    )}

                </div>

            )}

            <div className="overflow-x-auto">

                <table className="w-full">

                    <thead>

                        <tr className="bg-slate-50">

                            {columns.map((column) => (

                                <th
                                    key={column.key}
                                    className="
                                        px-6
                                        py-4
                                        text-left
                                        text-sm
                                        font-semibold
                                        uppercase
                                        tracking-wide
                                        text-slate-600
                                    "
                                >
                                    {column.title}
                                </th>

                            ))}

                        </tr>

                    </thead>

                    <tbody>

                        {filteredData.length > 0 ? (

                            filteredData.map((item, index) => (

                                <tr
                                    key={item.id}
                                    className={`
                                        border-t
                                        border-slate-100
                                        hover:bg-blue-50
                                        transition-colors
                                        ${index % 2 === 0
                                            ? "bg-white"
                                            : "bg-slate-50/40"
                                        }
                                    `}
                                >

                                    {columns.map((column) => (

                                        <td
                                            key={column.key}
                                            className="px-6 py-4 text-sm text-slate-700"
                                        >

                                            {
                                                column.render
                                                    ? column.render(item)
                                                    : item[column.key]
                                            }

                                        </td>

                                    ))}

                                </tr>

                            ))

                        ) : (

                            <tr>

                                <td
                                    colSpan={columns.length}
                                    className="py-12 text-center text-slate-400"
                                >
                                    Tidak ada data ditemukan.
                                </td>

                            </tr>

                        )}

                    </tbody>

                </table>

            </div>

        </div>

    );

}