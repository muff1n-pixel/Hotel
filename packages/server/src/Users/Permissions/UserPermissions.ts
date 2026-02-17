import { PermissionAction } from "@shared/Interfaces/Permissions/PermissionMap";
import User from "../User";

export default class UserPermissions {
    private permissions: PermissionAction[] = [];

    constructor(private readonly user: User) {

    }

    public async loadPermissions() {
        const roles = await this.user.model.getRoles({
            include: [
                {
                    association: "permissions"
                }
            ]
        });

        const permissions = roles.flatMap((role) => role.permissions?.map(p => p.id) ?? []);

        this.permissions = [...new Set(permissions)];
    }

    public hasPermission(action: PermissionAction) {
        return this.permissions.includes(action);
    }

    public getPermissionData() {
        return this.permissions;
    }
}
