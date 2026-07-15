import { X } from "lucide-react";

export default function Modal({
    open,
    title,
    description,
    children,
    footer,
    onClose,
    closeDisabled = false,
    maxWidth = "max-w-2xl"
}) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div
                className={`
                    w-full
                    ${maxWidth}
                    max-h-[90vh]
                    overflow-hidden
                    rounded-2xl
                    bg-white
                    shadow-xl
                    flex
                    flex-col
                `}
            >
                <div className="flex items-start justify-between gap-4 border-b px-6 py-5">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">
                            {title}
                        </h2>

                        {description && (
                            <p className="mt-1 text-sm text-slate-500">
                                {description}
                            </p>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={closeDisabled}
                        className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                        title="Tutup"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="overflow-y-auto px-6 py-5">
                    {children}
                </div>

                {footer && (
                    <div className="flex flex-col gap-3 border-t px-6 py-4 sm:flex-row sm:justify-end">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}