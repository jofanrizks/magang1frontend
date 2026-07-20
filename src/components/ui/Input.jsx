export default function Input({
    label,
    error,
    className = "",
    ...props
}) {
    return (
        <div>
            {label && (
                <label className="mb-1 block text-sm font-medium text-gray-700">
                    {label}
                </label>
            )}

            <input
                {...props}
                className={`
                    w-full
                    rounded-lg
                    border
                    px-3
                    py-2
                    outline-none
                    transition
                    ${
                        error
                            ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                            : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    }
                    ${className}
                `}
            />

            {error && (
                <p className="mt-1 text-sm text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
}