import { useEffect, useState } from "react";
import useThrottledCallback from "../../hooks/useThrottledCallback";

import { History } from "lucide-react";

export default function ActivityLog({ logs = [], userId, fetchPage }) {
    console.log("logs di ActivityLog", logs);
    const [loadedLogs, setLoadedLogs] = useState(logs);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(Boolean(userId));
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setLoadedLogs(logs);
        setPage(1);
        setHasMore(Boolean(userId));
    }, [logs]);

    async function loadMore() {
        if (!userId || !fetchPage || isLoading || !hasMore) return;

        setIsLoading(true);

        try {
            const response = await fetchPage(userId, page + 1);
            const pagination = response.data.data;

            setLoadedLogs((currentLogs) => [
                ...currentLogs,
                ...pagination.data,
            ]);

            setPage(pagination.current_page);
            setHasMore(Boolean(pagination.next_page_url));
        } catch (error) {
            console.error("Gagal memuat riwayat aktivitas:", error);
        } finally {
            setIsLoading(false);
        }
    }

    const throttledLoadMore = useThrottledCallback(loadMore, 300);

    function handleScroll(event) {
        const { scrollTop, clientHeight, scrollHeight } = event.currentTarget;

        if (scrollHeight - scrollTop - clientHeight <= 80) {
            throttledLoadMore();
        }
    }

    return (
    <div>
        <div className="border-b border-slate-200 px-5 py-4">
            <div className="flex items-center gap-2 text-slate-800">
                <span className="text-blue-600">
                    <History size={19} />
                </span>

                    <h3 className="font-semibold">
                        Riwayat Aktivitas
                    </h3>
            </div>
        </div>

        <div
            onScroll={handleScroll}
            className="max-h-120 overflow-y-auto"
        >
            {loadedLogs.length > 0 ? (
                <>
                    {loadedLogs.map((log) => (
                        <div
                            key={log.id}
                            className="border-b border-slate-100 px-5 py-4 last:border-b-0"
                        >
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                <div>
                                    <p className="font-semibold text-slate-800">
                                        {log.activity}
                                    </p>

                                    <p className="mt-1 text-sm text-slate-600">
                                        {log.description}
                                    </p>

                                    <p className="mt-2 text-xs text-slate-400">
                                        IP: {log.ip_address ?? "-"}
                                    </p>
                                </div>

                                <span className="whitespace-nowrap text-xs font-medium text-slate-500">
                                    {new Date(log.created_at).toLocaleString(
                                        "id-ID",
                                        {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        }
                                    )}
                                </span>
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="px-6 py-4 text-center text-sm text-slate-400">
                            Memuat riwayat...
                        </div>
                    )}
                </>
            ) : (
                <div className="px-6 py-12 text-center text-sm text-slate-400">
                    Belum ada riwayat aktivitas.
                </div>
            )}
        </div>
    </div>
    );
}