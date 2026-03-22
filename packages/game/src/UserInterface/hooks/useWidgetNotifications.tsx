import { useEffect, useState } from "react";
import { clientInstance } from "../..";

export function useWidgetNotifications() {
    const [value, setValue] = useState(clientInstance.widgetNotifications.value);
    const [_state, setState] = useState(clientInstance.widgetNotifications.state);

    useEffect(() => {
        return clientInstance.widgetNotifications.subscribe((value) => {
            setValue(value);
            setState(clientInstance.widgetNotifications.state);
        });
    }, []);

    return value;
}
