import { useEffect, useState } from "react";
import { getAllUsers } from "../services/userService";

export default function Dashboard() {

    const [users, setUsers] = useState([]);

    useEffect(() => {

        fetchUsers();

    }, []);

    async function fetchUsers() {

        try {

            const res = await getAllUsers();

            setUsers(res.data.data);

        } catch (err) {

            console.log(err);

        }

    }

    return (
        <>
            <h1>Total User : {users.length}</h1>
        </>
    );
}