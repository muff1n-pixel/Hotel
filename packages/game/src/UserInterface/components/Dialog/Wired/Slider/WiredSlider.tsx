import "./WiredSlider.css";

export type WiredSliderProps = {
    value: number;
    onChange: (value: number) => void;

    min: number;
    max: number;
}

export default function WiredSlider({ min, max, value, onChange }: WiredSliderProps) {
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
            }} onClick={() => onChange(Math.max(0, value - 1))}/>

            <div className="wired-slider sprite_dialog_wired_slider-background">
                <input type="range" min={min} max={max} value={value} onChange={(event) => onChange(parseInt((event.target as HTMLInputElement).value))}/>
            </div>

            <div className="sprite_dialog_wired_arrow-right" style={{
                cursor: "pointer"
            }} onClick={() => onChange(Math.min(10, value + 1))}/>
        </div>
    );
}
