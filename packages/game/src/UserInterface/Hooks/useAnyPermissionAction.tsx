import { useEffect, useState } from "react";
import { clientInstance } from "../..";
import { PermissionAction } from "@pixel63/shared/Interfaces/Permissions/PermissionMap";

export function useAnyPermissionAction(actions: PermissionAction[]) {
    const [value, setValue] = useState(false);

    useEffect(() => {
        return clientInstance.permissions.subscribe((permissions) => {
            setValue(permissions?.some((permission) => actions.includes(permission)) ?? false);
        });
    }, [actions]);

    return value!;
}
