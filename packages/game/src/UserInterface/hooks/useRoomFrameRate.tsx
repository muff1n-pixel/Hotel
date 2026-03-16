import { useEffect, useState } from "react";
import { useRoomInstance } from "@UserInterface/Hooks/useRoomInstance";

export function useRoomFrameRate() {
    const room = useRoomInstance();

    const [value, setValue] = useState<number | undefined>(0);

    useEffect(() => {
        return room?.roomRenderer.frameRate?.subscribe((value) => {
            setValue(value);
        });
    }, [room]);

    return value;
}
