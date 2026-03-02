import "./WiredSlider.css";

export type WiredSliderProps = {
    value: number;
    onChange: (value: number) => void;

    min: number;
    max: number;

    step?: number;
}

export default function WiredSlider({ min, max, value, step, onChange }: WiredSliderProps) {
    return (
        <div style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-evenly",
            alignItems: "center",

            padding: 5
        }}>
            <div className="sprite_dialog_wired_arrow-right" style={{
                transform: "rotateZ(180deg)",
                cursor: "pointer"
            }} onClick={() => onChange(Math.max(min, value - (step ?? 1)))}/>

            <div className="wired-slider sprite_dialog_wired_slider-background">
                <input type="range" step={step} min={min} max={max} value={value} onChange={(event) => onChange(Math.max(0.5, Math.floor(parseFloat((event.target as HTMLInputElement).value))))}/>
            </div>

            <div className="sprite_dialog_wired_arrow-right" style={{
                cursor: "pointer"
            }} onClick={() => onChange(Math.min(max, Math.floor(value + (step ?? 1))))}/>
        </div>
    );
}
