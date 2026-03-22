export type WiredRadioProps = {
    value: any;
    onChange: (value: any) => void;

    items: {
        value: any;
        label: string;
    }[];
};

export default function WiredRadio({ items, value, onChange }: WiredRadioProps) {
    return items.map((item) => (
        <div key={item.value} style={{
            display: "flex",
            flexDirection: "row",
            gap: 6,

            fontSize: 12,

            cursor: "pointer"
        }} onClick={() => onChange(item.value)}>
            <div style={{
                border: "1px solid #FFFFFF",
                borderRadius: 6,
                
                width: 13,
                height: 13,

                boxSizing: "border-box",

                padding: 2,

                display: "flex"
            }}>
                {(item.value === value) && (
                    <div style={{
                        flex: 1,

                        borderRadius: "100%",

                        background: "#FFFFFF"
                    }}/>
                )}
            </div>

            <div>
                {item.label}
            </div>
        </div>
    ));
}
