import { useMemo, useState } from "react";

export default function Table({
    title,
    subtitle,
    columns,
    data = [],
    search = false,
    searchPlaceHolder = "Cari data...",
    sortable = true,
    pagination = true,
    pageSize = 10
}) {

    const [keyword, setKeyword] = useState("");
    const [sortConfig, setSortConfig] = useState(null);
    const [page, setPage] = useState(1);

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

    const sortedData = useMemo(() => {
        if (!sortConfig) return filteredData;

        return [...filteredData].sort((a, b) => {
            const first = a[sortConfig.key] ?? "";
            const second = b[sortConfig.key] ?? "";

            return String(first).localeCompare(
                String(second),
                "id-ID",
                {
                    numeric: true,
                    sensitivity: "base"
                }
            ) * (sortConfig.direction === "asc" ? 1 : -1);
        });
    }, [filteredData, sortConfig]);

    const totalPages =
        pagination
            ? Math.max(1, Math.ceil(sortedData.length / pageSize))
            : 1;

    const visibleData = useMemo(() => {
        if (!pagination) return sortedData;

        const safePage = Math.min(page, totalPages);
        const start = (safePage - 1) * pageSize;

        return sortedData.slice(start, start + pageSize);
    }, [pagination, sortedData, page, pageSize, totalPages]);

    function toggleSort(column) {
        if (!sortable || column.render || column.sortable === false) return;

        setSortConfig((previous) => {
            if (previous?.key !== column.key) {
                return {
                    key: column.key,
                    direction: "asc"
                };
            }

            if (previous.direction === "asc") {
                return {
                    key: column.key,
                    direction: "desc"
                };
            }

            return null;
        });
    }

    function changeKeyword(value) {
        setKeyword(value);
        setPage(1);
    }

    function changePage(nextPage) {
        setPage(Math.min(Math.max(nextPage, 1), totalPages));
    }

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
                                changeKeyword(e.target.value)
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
                                    onClick={() => toggleSort(column)}
                                    className={`
                                        px-6
                                        py-4
                                        text-sm
                                        font-semibold
                                        uppercase
                                        tracking-wide
                                        text-slate-600
                                        ${
                                            column.align === "center"
                                                ? "text-center"
                                                : column.align === "right"
                                                ? "text-right"
                                                : "text-left"
                                        }
                                        ${
                                            sortable &&
                                            !column.render &&
                                            column.sortable !== false
                                                ? "cursor-pointer select-none"
                                                : ""
                                        }
                                    `}  
                                >
                                    <span className="inline-flex items-center gap-1">
                                        {column.title}
                                        {sortConfig?.key === column.key && (
                                            <span className="text-xs">
                                                {sortConfig.direction === "asc" ? "▲" : "▼"}
                                            </span>
                                        )}
                                    </span>
                                </th>

                            ))}

                        </tr>

                    </thead>

                    <tbody>

                        {visibleData.length > 0 ? (

                            visibleData.map((item, index) => (

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
                                            className={`
                                                px-6
                                                py-4
                                                text-sm
                                                text-slate-700
                                                ${
                                                    column.align === "center"
                                                        ? "text-center"
                                                        : column.align === "right"
                                                        ? "text-right"
                                                        : "text-left"
                                                }
                                            `}
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

            {pagination && sortedData.length > 0 && (
                <div className="flex flex-col gap-3 border-t border-slate-200 px-6 py-4 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
                    <span>
                        Menampilkan {visibleData.length} dari {sortedData.length} data
                    </span>

                    <div className="flex items-center justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => changePage(page - 1)}
                            disabled={page <= 1}
                            className="rounded-lg border px-3 py-2 font-medium transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Prev
                        </button>

                        <span className="px-2">
                            {page} / {totalPages}
                        </span>

                        <button
                            type="button"
                            onClick={() => changePage(page + 1)}
                            disabled={page >= totalPages}
                            className="rounded-lg border px-3 py-2 font-medium transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

        </div>

    );

}
