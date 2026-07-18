import { useEffect, useState } from "react";
import { useRoomInstance } from "@UserInterface/Hooks/useRoomInstance";

export function useRoomGroup() {
    const room = useRoomInstance();

    const [value, setValue] = useState(room?.group.value);
    const [_state, setState] = useState(room?.group.state);

    useEffect(() => {
        return room?.group?.subscribe((value) => {
            setValue(value);
            setState(room.group.state);
        });
    }, [room]);

    return value;
}
