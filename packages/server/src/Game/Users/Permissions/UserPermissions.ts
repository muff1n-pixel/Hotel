import { PermissionAction } from "@shared/Interfaces/Permissions/PermissionMap";
import { UserModel } from "../../../Database/Models/Users/UserModel";

export default class UserPermissions {
    private permissions: PermissionAction[] = [];

    constructor(private readonly user: UserModel) {

    }

    public async loadPermissions() {
        const roles = await this.user.getRoles({
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
