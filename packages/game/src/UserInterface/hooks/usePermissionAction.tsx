import { useEffect, useState } from "react";
import { clientInstance } from "../..";
import { PermissionAction } from "@pixel63/shared/Interfaces/Permissions/PermissionMap";

export function usePermissionAction(action: PermissionAction) {
    const [value, setValue] = useState(false);

    useEffect(() => {
        return clientInstance.permissions.subscribe((permissions) => {
            setValue(permissions?.includes(action) ?? false);
        });
    }, [action]);

    return value!;
}
