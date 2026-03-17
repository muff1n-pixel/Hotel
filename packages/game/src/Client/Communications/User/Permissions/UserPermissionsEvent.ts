import { clientInstance } from "../../../..";
import ProtobuffListener from "@Client/Communications/ProtobuffListener";
import { UserPermissionsData } from "@pixel63/events";
import { PermissionAction } from "@Shared/Interfaces/Permissions/PermissionMap";

export default class UserPermissionsEvent implements ProtobuffListener<UserPermissionsData> {
    async handle(payload: UserPermissionsData) {
        clientInstance.permissions.value = payload.permissions as PermissionAction[];

        const modtoolsDialog = clientInstance.dialogs.value?.some((dialog) => dialog.id === "modtools");

        if(!modtoolsDialog) {
            if(["furniture:edit", "pets:edit"].some((permission) => payload.permissions.includes(permission))) {
                clientInstance.dialogs.value?.push({
                    id: "modtools",
                    type: "modtools",
                    data: null
                });

                clientInstance.dialogs.update();
            }
        }
    }
}
