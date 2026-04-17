import { useEffect, useState } from "react";
import { useRoomInstance } from "@UserInterface/Hooks/useRoomInstance";

export function useRoomFrameRate() {
    const room = useRoomInstance();

    const [value, setValue] = useState<number | undefined>(0);

    useEffect(() => {
        let animationFrame = window.requestAnimationFrame(updateAnimationFrame);

        function updateAnimationFrame() {
            setValue(room?.roomRenderer.frameRate);
            
            animationFrame = window.requestAnimationFrame(updateAnimationFrame);
        }

        return () => {
            window.cancelAnimationFrame(animationFrame);
        };
    }, [room]);

    return value;
}
