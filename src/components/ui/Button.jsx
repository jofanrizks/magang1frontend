export default function Button({
    children,
    className="",
    ...props
}) {
    return (
        <button
            {...props}
            className={`
            w-full
            bg-blue-600
            hover:bg-blue-700
            text-white
            p-3
            rounded-xl
            font-semibold
            ${className}
            `}
        >
            {children}
        </button>
    );
}