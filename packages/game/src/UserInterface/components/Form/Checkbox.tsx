export type CheckboxProps = {
    value: boolean;
    onChange: (value: boolean) => void;

    label: string;
};

export default function Checkbox({ label, value, onChange }: CheckboxProps) {
    return (
        <div style={{
            display: "flex",
            flexDirection: "row",
            gap: 4,

            fontSize: 12,

            cursor: "pointer"
        }} onClick={() => onChange(value)}>
            <div style={{
                border: "1px solid #808080",
                
                width: 15,
                height: 15,

                boxSizing: "border-box",

                padding: 1,

                display: "flex"
            }}>
                {(value) && (
                    <div style={{
                        flex: 1,

                        background: "#000"
                    }}/>
                )}
            </div>

            <div>
                {label}
            </div>
        </div>
    );
}
