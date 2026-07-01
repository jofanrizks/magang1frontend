import { useState } from "react";

export default function useUserModal() {

    const [selectedUser, setSelectedUser] = useState(null);

    function openUser(user) {

        setSelectedUser(user);

    }

    function closeUser() {

        setSelectedUser(null);

    }

    return {

        selectedUser,
        openUser,
        closeUser

    };

}