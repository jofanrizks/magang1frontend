export function getUserGroupIds(user) {
    return (user?.groups ?? [])
        .map((group) => Number(group.id))
        .filter((id) => Number.isFinite(id));
}

export function formatUserGroups(user) {
    const names = (user?.groups ?? [])
        .map((group) => group.name)
        .filter(Boolean);

    return names.length > 0 ? names.join(", ") : "-";
}
