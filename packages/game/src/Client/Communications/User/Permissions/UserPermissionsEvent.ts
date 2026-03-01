import { clientInstance } from "../../../..";
import ProtobuffListener from "@Client/Communications/ProtobuffListener";
import { UserPermissionsData } from "@pixel63/events";
import { PermissionAction } from "@Shared/Interfaces/Permissions/PermissionMap";

export default class UserPermissionsEvent implements ProtobuffListener<UserPermissionsData> {
    async handle(payload: UserPermissionsData) {
        clientInstance.permissions.value = payload.permissions as PermissionAction[];
    }
}
