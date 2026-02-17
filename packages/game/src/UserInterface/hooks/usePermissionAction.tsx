import { useEffect, useState } from "react";
import { clientInstance } from "../..";
import { PermissionAction } from "@Shared/Interfaces/Permissions/PermissionMap";

export function usePermissionAction(action: PermissionAction) {
    const [value, setValue] = useState(false);

    useEffect(() => {
        return clientInstance.permissions.subscribe((permissions) => {
            console.log(permissions)

            setValue(permissions?.includes(action) ?? false);
        });
    }, [action]);

    return value!;
}
