import { useEffect, useState } from "react";
import { clientInstance } from "../..";

export function useRoomUserTrading() {
    const [trading, setTrading] = useState(clientInstance?.roomUserTrading?.value);
    const [_state, setState] = useState(clientInstance?.roomUserTrading?.state);

    useEffect(() => {
        return clientInstance?.roomUserTrading?.subscribe((room) => {
            setTrading(room);
            setState(clientInstance.roomUserTrading.state);
        });
    }, []);

    return trading;
}
