export type WiredCheckboxProps = {
    value: boolean;
    onChange: (value: boolean) => void;

    label: string;
};

export default function WiredCheckbox({ label, value, onChange }: WiredCheckboxProps) {
    return (
        <div style={{
            display: "flex",
            flexDirection: "row",
            gap: 4,

            fontSize: 12,

            cursor: "pointer"
        }} onClick={() => onChange(!value)}>
            <div style={{
                border: "1px solid #FFFFFF",
                
                width: 13,
                height: 13,

                boxSizing: "border-box",

                padding: 2,

                display: "flex"
            }}>
                {(value) && (
                    <div style={{
                        flex: 1,

                        background: "#FFFFFF"
                    }}/>
                )}
            </div>

            <div>
                {label}
            </div>
        </div>
    );
}
