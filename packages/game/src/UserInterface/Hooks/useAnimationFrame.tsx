import { useEffect } from "react";

export default function useAnimationFrame(callback: () => void) {
    useEffect(() => {
        let stopped = false;

        function handleAnimationFrame() {
            if(stopped) {
                return;
            }

            callback();

            window.requestAnimationFrame(handleAnimationFrame);
        }

        window.requestAnimationFrame(handleAnimationFrame);

        return () => {
            stopped = true;
        };
    });
}
