import { useEffect, useState } from "react";
import { clientInstance } from "../..";
import { PermissionAction } from "@pixel63/shared/Interfaces/Permissions/PermissionMap";

export function usePermissions(actions: PermissionAction[]) {
    const [values, setValues] = useState(actions.map(() => false));

    useEffect(() => {
        return clientInstance.permissions.subscribe((value) => {
            setValues(actions.map((action) => value?.includes(action) ?? false));
        });
    }, []);

    return values;
}
