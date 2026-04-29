export type RoomFurnitureDimmerDialogColorsProps = {
    value: string;
    onChange: (color: string) => void;
}

export default function RoomFurnitureDimmerDialogColors({ value, onChange }: RoomFurnitureDimmerDialogColorsProps) {
    return (
        <div style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between"
        }}>
            {["#66FFFF", "#0066FF", "#FF66CC", "#FF3333", "#CCFF66", "#99FF33", "#000000"].map((color) => (
                <div key={color} style={{
                    width: 18,
                    height: 28,

                    border: "1px solid transparent",
                    borderColor: (value === color)?("white"):("transparent"),
                    borderRadius: 2,

                    padding: 1,

                    boxSizing: "border-box",

                    cursor: "pointer"
                }} onClick={() => onChange(color)}>
                    <div style={{
                        width: "100%",
                        height: "100%",

                        backgroundColor: color
                    }}>
                    </div>
                </div>
            ))}
        </div>
    );
}