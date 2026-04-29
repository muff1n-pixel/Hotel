import { useEffect, useState } from "react";
import { clientInstance } from "../..";

export function useSettings() {
    const [value, setValue] = useState(clientInstance.settings.value);
    const [_state, setState] = useState(clientInstance.settings.state);

    useEffect(() => {
        return clientInstance.settings.subscribe((value) => {
            setValue(value);
            setState(clientInstance.settings.state);
        });
    }, []);

    return value;
}
