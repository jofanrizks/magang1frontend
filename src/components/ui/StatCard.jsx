export default function StatCard({
    title,
    value,
    description,
    textColor = "text-blue-600"
}) {

    return (

        <div className="
            bg-white
            rounded-2xl
            border
            border-slate-200
            p-6
            transition
            hover:-translate-y-1
            hover:shadow-lg
        ">

            <p className="text-sm text-slate-500 font-medium">
                {title}
            </p>

            <h2 className={`text-5xl font-bold mt-4 ${textColor}`}>
                {value}
            </h2>

            <p className="text-sm text-slate-400 mt-6">
                {description}
            </p>

        </div>

    );

}