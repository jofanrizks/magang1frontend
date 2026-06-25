export default function Input({
    label,
    className = "",
    ...props
}) {
    return (
        <div className="space-y-2">
            <label className="font-medium">
                {label}
            </label>

            <input
                {...props}
                className={`
                w-full
                border
                rounded-xl
                p-3
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500
                ${className}
                `}
            />
        </div>
    );
}