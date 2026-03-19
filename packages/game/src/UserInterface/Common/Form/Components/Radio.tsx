export type RadioProps = {
    value: string;
    onChange: (value: string) => void;

    items: {
        value: string;
        label: string;
    }[];
};

export default function Radio({ items, value, onChange }: RadioProps) {
    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            gap: 5
        }}>
            {items.map((item) => (
                <div key={item.value} style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 4,

                    fontSize: 12,

                    cursor: "pointer"
                }} onClick={() => onChange(item.value)}>
                    <div style={{
                        border: "1px solid #808080",
                        
                        width: 15,
                        height: 15,

                        borderRadius: "100%",

                        boxSizing: "border-box",

                        padding: 2,

                        display: "flex"
                    }}>
                        {(item.value === value) && (
                            <div style={{
                                flex: 1,
                                
                                borderRadius: "100%",

                                background: "#000"
                            }}/>
                        )}
                    </div>

                    <div>
                        {item.label}
                    </div>
                </div>
            ))}
        </div>
    );
}
