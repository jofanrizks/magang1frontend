import { useEffect, useState } from "react";
import useThrottledCallback from "../../hooks/useThrottledCallback";

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
        <div className="p-8">
            <div className="mb-4 border-b-2 border-slate-200 pb-3">
                <h2 className="text-xl font-bold">Riwayat Aktivitas</h2>
            </div>

            {loadedLogs.length > 0 ? (
                <div
                    onScroll={handleScroll}
                    className="space-y-4 max-h-144 overflow-y-auto pr-2"
                >
                    {loadedLogs.map((log) => (
                        <div
                            key={log.id}
                            className="border-b border-slate-200 p-5 transition"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-semibold text-slate-800">
                                        {log.activity}
                                    </h3>

                                    <p className="mt-1 text-sm text-slate-500">
                                        {log.description}
                                    </p>
                                </div>

                                <span className="whitespace-nowrap text-xs text-slate-400">
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

                            {log.ip_address && (
                                <div className="mt-3 text-xs text-slate-400">
                                    IP Address: {log.ip_address}
                                </div>
                            )}
                        </div>
                    ))}

                    {isLoading && (
                        <p className="py-2 text-center text-sm text-slate-400">
                            Memuat riwayat...
                        </p>
                    )}
                </div>
            ) : (
                <div className="py-10 text-center text-slate-400">
                    Belum ada riwayat aktivitas.
                </div>
            )}
        </div>
    );
}