import { clientInstance, webSocketClient } from "@Game/index";
import { GetUserHabboClubData } from "@pixel63/events";
import { useEffect, useState } from "react";

export function useUserHabboClub() {
    const [value, setValue] = useState(clientInstance.userHabboClub.value);
    const [_state, setState] = useState(clientInstance.userHabboClub.state);

    useEffect(() => {
        if (!clientInstance.userHabboClub.value) {
            webSocketClient.sendProtobuff(GetUserHabboClubData, GetUserHabboClubData.create({}));
        }

        return clientInstance.userHabboClub.subscribe((user) => {
            setValue(user);
            setState(clientInstance.userHabboClub.state);
        });
    }, []);

    return value;
}
