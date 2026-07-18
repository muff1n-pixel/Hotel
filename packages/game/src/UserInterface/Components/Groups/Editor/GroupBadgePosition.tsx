export type GroupBadgePositionProps = {
    position?: number;
    onChange: (position: number) => void;
}

export default function GroupBadgePosition({ position, onChange }: GroupBadgePositionProps) {
    return (
        <div style={{
            background: "#000000",

            border: "1px solid #000000",
            borderRadius: 3,

            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gridTemplateRows: "1fr 1fr 1fr",

            gap: 1,

            width: "max-content"
        }}>
            {Array(9).fill(null).map((_, index) => (
                <div key={index} style={{
                    background: (position === (index + 1))?("transparent"):("#E9E9E0"),
                    borderRadius: 2,

                    width: 14,
                    height: 14,

                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",

                    cursor: "pointer"
                }} onClick={() => onChange(index + 1)}>
                    {(position === (index + 1)) && (
                        <div style={{
                            width: 6,
                            height: 6,

                            borderRadius: 10,
                            borderWidth: 3,
                            borderColor: "#E9E9E0",
                            borderStyle: "solid"
                        }}/>
                    )}
                </div>
            ))}
        </div>
    );
}