import "./DimmerDialogSlider.css";

export type DimmerDialogSliderProps = {
    value: number;
    onChange: (value: number) => void;
}

export default function DimmerDialogSlider({ value, onChange }: DimmerDialogSliderProps) {
    return (
        <div className="dimmer-dialog-slider">
            <input type="range" min="0" max="255" value={value} onChange={(event) => onChange(parseInt((event.target as HTMLInputElement).value))}/>
        </div>
    );
}
