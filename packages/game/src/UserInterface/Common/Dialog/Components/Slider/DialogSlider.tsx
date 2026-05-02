import { CSSProperties } from "react";
import "./DialogSlider.css";

export type DialogSliderProps = {
    value: number;
    onChange: (value: number) => void;

    min: number;
    max: number;

    step?: number;

    style?: CSSProperties;
}

export default function DialogSlider({ min, max, value, step, onChange, style }: DialogSliderProps) {
    return (
        <div style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-evenly",
            alignItems: "center",

            gap: 5,
            padding: 5
        }}>
            <div className="sprite_sub" style={{
                cursor: "pointer"
            }} onClick={() => onChange(Math.max(min, value - (step ?? 1)))}/>

            <div className="dialog-slider sprite_dialog_wired_slider-background" style={{
                filter: "invert(1)",

                ...style
            }}>
                <input type="range" step={step} min={min} max={max} value={value} onChange={(event) => onChange(Math.max(0, parseFloat((event.target as HTMLInputElement).value)))}/>
            </div>

                <div className="sprite_add" style={{
                cursor: "pointer"
            }} onClick={() => onChange(Math.min(max, value + (step ?? 1)))}/>
        </div>
    );
}
