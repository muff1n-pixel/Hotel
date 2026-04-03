import { useEffect, useRef, useState } from "react";

export default function useTraxSlider() {
    const sliderContainerRef = useRef<HTMLDivElement>(null);
    
    const [sliderIndex, setSliderIndex] = useState(0);
    const [movingSlider, setMovingSlider] = useState(false);

    useEffect(() => {
        if(!movingSlider) {
            return;
        }

        if(!sliderContainerRef.current) {
            return;
        }

        const rectangle = sliderContainerRef.current.getBoundingClientRect();

        const mousemoveListener = (event: MouseEvent) => {
            const relativePosition = event.pageX - rectangle.x;

            setSliderIndex(Math.min(Math.max(0, Math.round(relativePosition / 22)), 23));
        };

        const mouseupListener = () => {
            setMovingSlider(false);
        };

        document.addEventListener("mousemove", mousemoveListener);
        document.addEventListener("mouseup", mouseupListener);

        return () => {
            document.removeEventListener("mousemove", mousemoveListener);
            document.removeEventListener("mouseup", mouseupListener);
        };
    }, [movingSlider, sliderContainerRef]);

    return {
        sliderContainerRef,
        sliderIndex,

        setMovingSlider,
        handleSliderMouseDown: () => setMovingSlider(true)
    };
}