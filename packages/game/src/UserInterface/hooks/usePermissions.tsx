import { useEffect, useState } from "react";
import { clientInstance } from "../..";

export function usePermissions() {
    const [value, setValue] = useState(clientInstance.permissions.value);

    useEffect(() => {
        return clientInstance.permissions.subscribe((value) => {
            setValue(value);
        });
    }, []);

    return value!;
}
