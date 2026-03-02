import WiredSlider from "./Slider/WiredSlider";
import WiredSection from "./WiredSection";

export type WiredDelayProps = {
    value: number;
    onChange: (value: number) => void;
};

export default function WiredDelay({ value, onChange }: WiredDelayProps) {
    return (
        <WiredSection>
            <b>Delay effect for {value} seconds</b>

            <WiredSlider min={0} max={10} value={value} onChange={onChange}/>
        </WiredSection>
    );
}
