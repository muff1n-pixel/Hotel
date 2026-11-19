import Colors, { HSL } from "@UserInterface/Utils/Colors";
import HueSaturationLightnessSlider from "./HueSaturationLightnessSlider";
import Input from "@UserInterface/Common/Form/Components/Input";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export type DialogHSLPickerProps = {
    value: HSL;
    onChange: (value: HSL) => void;
}

export default function DialogHSLPicker({ value, onChange }: DialogHSLPickerProps) {
    const [hex, setHex] = useState(Colors.hslToHex(value));
    const [getTranslation] = useTranslation("common");

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            gap: 10
        }}>
            <b>{getTranslation("hue")}</b>

            <HueSaturationLightnessSlider hsl={value} property="hue" value={value.h / 360} onChange={(hue) => {
                onChange({
                    ...value,
                    h: hue * 360
                });
            }}/>
            
            <b>{getTranslation("saturation")}</b>

            <HueSaturationLightnessSlider hsl={value} property="saturation" value={value.s / 100} onChange={(saturation) => {
                onChange({
                    ...value,
                    s: saturation * 100
                });
            }}/>
            
            <b>{getTranslation("brightness")}</b>

            <HueSaturationLightnessSlider hsl={value} property="lightness" value={value.l / 100} onChange={(lightness) => {
                onChange({
                    ...value,
                    l: lightness * 100
                });
            }}/>
            
            <Input value={hex} onChange={(value) => {
                setHex(value);

                try {
                    onChange(Colors.hexToHSL(value));
                }
                catch {
                    console.warn("Failed to parse HEX to HSL.");
                }
            }}/>
        </div>
    );
}
