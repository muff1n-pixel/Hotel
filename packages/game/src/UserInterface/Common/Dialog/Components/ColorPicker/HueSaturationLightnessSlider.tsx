import { HSL } from "@UserInterface/Utils/Colors";
import { MouseEvent, useCallback, useMemo, useRef } from "react";

export type HueSaturationLightnessSliderProps = {
    value: number;
    onChange: (value: number) => void;

    hsl: HSL;
    property: "hue" | "saturation" | "lightness";
}

export default function HueSaturationLightnessSlider({ hsl, value, property, onChange }: HueSaturationLightnessSliderProps) {
    const mouseDownRef = useRef(false);

    const background = useMemo(() => {
        switch(property) {
            case "hue": {
                return `linear-gradient(to right, ${Array(360 / 30).fill(null).map((_, index) => `hsl(${index * 30}, 100%, 50%)`).join(', ')})`;
            }
            
            case "saturation": {
                return `linear-gradient(to right, ${Array(100 / 10).fill(null).map((_, index) => `hsl(${hsl.h}, ${index * 10}%, ${hsl.l}%)`).join(', ')})`;
            }
            
            case "lightness": {
                return `linear-gradient(to right, ${Array(100 / 10).fill(null).map((_, index) => `hsl(${hsl.h}, ${hsl.s}%, ${index * 10}%)`).join(', ')})`;
            }
        }
    }, [property, hsl]);

    const handleMouseMove = useCallback((event: MouseEvent) => {
        if(!mouseDownRef.current) {
            return;
        }

        const target = (event.target as HTMLDivElement);

        const boundingClientRect = target.getBoundingClientRect();

        const value = ((event.pageX - boundingClientRect.left) / target.clientWidth);

        onChange(value);
    }, [onChange]);

    const handleMouseDown = useCallback((event: MouseEvent) => {
        mouseDownRef.current = true;

        handleMouseMove(event)
    }, [handleMouseMove]);

    const handleMouseUp = useCallback(() => {
        mouseDownRef.current = false;
    }, []);

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            
            gap: 1,
            
            paddingBottom: 5
        }} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
            <div style={{
                height: 12,

                background
                //background: "linear-gradient(to right,  hsl(0, 100%, 50%), hsl(30, 100%, 50%), hsl(60, 100%, 50%), hsl(90, 100%, 50%), hsl(120, 100%, 50%), hsl(150, 100%, 50%), hsl(180, 100%, 50%), hsl(210, 100%, 50%), hsl(240, 100%, 50%), hsl(270, 100%, 50%), hsl(300, 100%, 50%), hsl(330, 100%, 50%), hsl(360, 100%, 50%))"
            }}/>

            <div style={{
                height: 10,
                background: "#96A8BB",

                borderTop: "1px solid #758698",
                borderBottom: "1px solid #E9EBED",

                cursor: "pointer",

                position: "relative"
            }}>
                <div className="sprite_dialog_cursor" style={{
                    transform: "translate(-50%, -10px)",

                    pointerEvents: "none",

                    position: "absolute",

                    left: `${value * 100}%`
                }}/>
            </div>
        </div>
    );
}
