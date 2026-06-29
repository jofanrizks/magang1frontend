export default function StatCard({
    title,
    value,
    description,
    textColor = "text-blue-600"
}) {

    return (

            <div
                className="
                    bg-white
                    rounded-2xl
                    border border-slate-200
                    shadow
                    p-6
                    transition-all
                    duration-300
                    hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)]
                    hover:-translate-y-1
                "
            >

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