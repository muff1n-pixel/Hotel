import { useEffect, useState } from "react";
import { clientInstance } from "../..";

export function useFlyingFurnitureIcons() {
    const [value, setValue] = useState(clientInstance.flyingFurnitureIcons.value);
    const [_state, setState] = useState(clientInstance.flyingFurnitureIcons.state);

    useEffect(() => {
        return clientInstance.flyingFurnitureIcons.subscribe((value) => {
            setValue(value);
            setState(clientInstance.flyingFurnitureIcons.state);
        });
    }, []);

    return value;
}
