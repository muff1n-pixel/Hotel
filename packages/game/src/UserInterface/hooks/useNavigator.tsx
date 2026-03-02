import { useEffect, useState } from "react";
import { clientInstance, webSocketClient } from "../..";
import { GetNavigatorData } from "@pixel63/events";

export function useNavigator(category: string, search?: string) {
    const [navigator, setNavigator] = useState(clientInstance.navigator.value);
    const [_state, setState] = useState(clientInstance.navigator.state);

    useEffect(() => {
        return clientInstance.navigator.subscribe((navigator) => {
            setNavigator(navigator);
            setState(clientInstance.navigator.state);
        });
    }, []);

    useEffect(() => {
        if (search?.length) {
            webSocketClient.sendProtobuff(GetNavigatorData, GetNavigatorData.create({
                search
            }));
        }
        else {
            webSocketClient.sendProtobuff(GetNavigatorData, GetNavigatorData.create({
                category
            }));
        }
    }, [category, search]);

    return navigator;
}
