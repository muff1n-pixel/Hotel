import { clientInstance } from "@Game/index";
import { useRoomInstance } from "@UserInterface/Hooks/useRoomInstance";
import { useEffect, useState } from "react";

export default function useRoomClickConfiguration() {
    const roomInstance = useRoomInstance();

    const [roomClickConfiguration, setRoomClickConfiguration] = useState(roomInstance?.clickConfiguration.value);
    const [_state, setState] = useState(clientInstance.roomHistory.state);

    useEffect(() => {
        return roomInstance?.clickConfiguration.subscribe((value) => {
            setRoomClickConfiguration(value);
            setState(roomInstance.clickConfiguration.state);
        });
    }, [roomInstance]);

    return roomClickConfiguration;
}