import { useEffect, useState } from "react";
import { clientInstance, webSocketClient } from "../..";
import { GetNavigatorData } from "@pixel63/events";

export function useNavigator(category: string, filter?: string, search?: string) {
    const [navigator, setNavigator] = useState(clientInstance.navigator.value);
    const [_state, setState] = useState(clientInstance.navigator.state);

    useEffect(() => {
        return clientInstance.navigator.subscribe((navigator) => {
            setNavigator(navigator);
            setState(clientInstance.navigator.state);
        });
    }, []);

    useEffect(() => {
        webSocketClient.sendProtobuff(GetNavigatorData, GetNavigatorData.create({
            category,
            filter,
            search
        }));
    }, [category, filter, search]);

    return navigator;
}
