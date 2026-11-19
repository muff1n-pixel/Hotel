import { useTranslation } from "react-i18next";
import WiredSlider from "./Slider/WiredSlider";
import WiredSection from "./WiredSection";

export type WiredDelayProps = {
    value: number;
    onChange: (value: number) => void;
};

export default function WiredDelay({ value, onChange }: WiredDelayProps) {
    const [getTranslation] = useTranslation("wired");
    return (
        <WiredSection>
            <b>{getTranslation("creator.delay_effect", { count: value })}</b>

            <WiredSlider min={0} max={10} value={value} onChange={onChange}/>
        </WiredSection>
    );
}
