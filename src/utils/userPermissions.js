export function canManageTarget(currentUser, targetUser) {
    if (!currentUser || !targetUser) return false;

    if (currentUser.id === targetUser.id) return false;

    if (currentUser.role === "super_admin") {
        return ["admin", "user", "viewer"].includes(targetUser.role);
    }

    if (currentUser.role === "admin") {
        return ["user", "viewer"].includes(targetUser.role);
    }

    return false;
}

export function getManageableRoles(currentUser) {
    if (currentUser?.role === "super_admin") {
        return ["admin", "user", "viewer"];
    }

    if (currentUser?.role === "admin") {
        return ["user", "viewer"];
    }

    return [];
}

export function canCreateUsers(currentUser) {
    return getManageableRoles(currentUser).length > 0;
}

export function canUseRole(currentUser, role) {
    return getManageableRoles(currentUser).includes(role);
}

export function canViewAdminArea(currentUser) {
    return ["super_admin", "admin"].includes(currentUser?.role);
}

export function canEditUser(currentUser, targetUser) {
    return canManageTarget(currentUser, targetUser);
}

export function canResetPassword(currentUser, targetUser) {
    return canManageTarget(currentUser, targetUser);
}

export function canApproveUser(currentUser, targetUser) {
    return canManageTarget(currentUser, targetUser) &&
        targetUser?.approval === "pending";
}

export function canRejectUser(currentUser, targetUser) {
    return canApproveUser(currentUser, targetUser);
}

export function canDisableUser(currentUser, targetUser) {
    return canManageTarget(currentUser, targetUser) &&
        targetUser?.sts !== "disabled";
}

export function canEnableUser(currentUser, targetUser) {
    return canManageTarget(currentUser, targetUser) &&
        targetUser?.sts === "disabled";
}

export function canDeleteUser(currentUser, targetUser) {
    return canManageTarget(currentUser, targetUser);
}