export type DimmerDialogCheckboxProps = {
    label: string;
    value: boolean;
    onChange: (value: boolean) => void;
};

export default function DimmerDialogCheckbox({ label, value, onChange }: DimmerDialogCheckboxProps) {
    return (
        <div style={{
            display: "flex",
            flexDirection: "row",
            gap: 4,
        }}>
            <div style={{
                border: "1px solid #00ED1F",
                
                width: 15,
                height: 15,

                boxSizing: "border-box",

                padding: 1,

                display: "flex",

                cursor: "pointer"
            }} onClick={() => onChange(!value)}>
                {(value) && (
                    <div style={{
                        flex: 1,

                        background: "#00ED1F"
                    }}/>
                )}
            </div>

            <div>
                {label}
            </div>
        </div>
    );
}