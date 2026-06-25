import { useNavigate } from "react-router-dom";


export default function Navbar() {
const navigate = useNavigate();
function logout() {

    localStorage.removeItem(
        "token"
    );

    localStorage.removeItem(
        "user"
    );

    navigate("/login");

}

    return (

        <div className="
            bg-white
            shadow
            p-5
            flex
            justify-between
            

        ">

            <h1 className="font-bold text-xl">

                Sistem

            </h1>

            <button
                onClick={logout}
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