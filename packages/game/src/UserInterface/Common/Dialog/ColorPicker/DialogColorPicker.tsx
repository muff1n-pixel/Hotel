import { Hue, Saturation, useColor } from "react-color-palette";

import "react-color-palette/dist/css/rcp.css";
import "./DialogColorPicker.css";
import Input from "../../Form/Components/Input";

export type DialogColorPickerProps = {
    value: string;
    onChange: (value: string) => void;
}

export default function DialogColorPicker({ value, onChange }: DialogColorPickerProps) {
    const [color] = useColor(value);

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            gap: 10
        }}>
            <div className="dialog-color-picker" style={{
                display: "flex",
                flexDirection: "column",
                gap: 10
            }}>
                <Saturation height={240} color={color} onChange={(color) => onChange(color.hex)} />
                <Hue color={color} onChange={(color) => onChange(color.hex)} />
            </div>

            <Input value={color.hex} onChange={(value) => onChange(value)}/>
        </div>
    );
}
