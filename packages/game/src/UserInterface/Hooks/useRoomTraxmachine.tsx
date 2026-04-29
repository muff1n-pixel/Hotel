import { useEffect, useState } from "react";
import { useRoomInstance } from "@UserInterface/Hooks/useRoomInstance";

export function useRoomTraxmachine() {
    const room = useRoomInstance();

    const [value, setValue] = useState(room?.traxmachine.value);
    const [state, setState] = useState(room?.traxmachine.state);

    useEffect(() => {
        return room?.traxmachine?.subscribe((value) => {
            setValue(value);
            setState(room.traxmachine.state);
        });
    }, [room]);

    return value;
}
