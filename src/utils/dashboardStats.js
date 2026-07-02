export default function dashboardStats(users) {

    return {

        total: users.length,

        pending: users.filter(
            user => user.approval === "pending"
        ).length,

        approved: users.filter(
            user => user.approval === "approved"
        ).length,

        aktif: users.filter(
            user => user.sts === "aktif"
        ).length,

        disabled: users.filter(
            user => user.sts === "disabled"
        ).length

    };

}