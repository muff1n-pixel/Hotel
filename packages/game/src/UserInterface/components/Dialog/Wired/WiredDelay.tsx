import WiredSection from "./WiredSection";

export type WiredDelayProps = {
    value: number;
    onChange: (value: number) => void;
};

export default function WiredDelay({ value, onChange }: WiredDelayProps) {
    return (
        <WiredSection>
            <b>Delay effect for {value} seconds</b>
    
            <input type="number" min={0} max={10} placeholder={"0"} value={value} onChange={(event) => onChange(parseInt((event.target as HTMLInputElement).value))} style={{
                background: "transparent",
                border: "1px solid #FFFFFF",

                fontFamily: "Ubuntu",
                fontSize: 12,

                color: "#FFFFFF"
            }}/>
        </WiredSection>
    );
}
