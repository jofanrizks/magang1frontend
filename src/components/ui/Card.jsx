export default function Card({
    title,
    value
}) {

    return (

        <div className="
        bg-white
        rounded-2xl
        shadow
        p-6">

            <h1 className="text-slate-500">

                {title}

            </h1>

            <h2 className="text-4xl font-bold mt-4">

                {value}

            </h2>

        </div>

    );

}