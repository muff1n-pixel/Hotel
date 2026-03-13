export type WiredInputProps = {
    value: string;
    onChange: (value: string) => void;

    placeholder?: string;
    readonly?: boolean;
};

export default function WiredInput({ placeholder, readonly, value, onChange }: WiredInputProps) {
    return (
        <input type="text" placeholder={placeholder} readOnly={readonly} value={value} onChange={(event) => onChange((event.target as HTMLInputElement).value)} style={{
            background: "transparent",
            border: "1px solid #FFFFFF",

            fontFamily: "Ubuntu",
            fontSize: 12,

            color: "#FFFFFF"
        }}/>
    );
}
