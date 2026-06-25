export default function Navbar() {

    return (

        <div className="
            bg-white
            shadow
            p-5
            flex
            justify-between
        ">

            <h1 className="font-bold text-xl">

                Dashboard

            </h1>

            <button
                className="
                bg-red-500
                text-white
                px-4
                py-2
                rounded-xl"
            >

                Logout

            </button>

        </div>

    );
}