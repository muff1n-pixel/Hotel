import { useEffect, useState } from "react";
import { useRoomInstance } from "@UserInterface/Hooks/useRoomInstance";

export function useRoomFrameRate() {
    const room = useRoomInstance();

    const [value, setValue] = useState<number | undefined>(0);

    useEffect(() => {
        if(!room) {
            return;
        }
        
        const interval = setInterval(() => {
            setValue(Math.round(room?.roomRenderer.application.ticker?.FPS ?? 0));
        }, 100);

        return () => {
            clearInterval(interval);
        };
    }, [room]);

    return value;
}
