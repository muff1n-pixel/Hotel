import FlexLayout from "@UserInterface/Common/Layouts/FlexLayout";

const colors = [
    "#FFD500",
    "#FFFFFF",
    "#FB6D00",
    "#5DE100",
    "#3A9C00",
    "#8AFF66",
    "#00C2FF",
    "#61E8C5",

    "#006ED5",
    "#B8EAFF",
    "#FF8FE6",
    "#FF00C3",
    "#FF0012",
    "#A534EF",
    "#E8A3FF",
    "#BD0000",

    "#FFB16C",
    "#FFF140",
    "#FDE6A3",
    "#C6A963",
    "#9B7435",
    "#BFBFBF",
    "#797979",
    "#363636"
];

export type GroupBadgeColorProps = {
    color?: string;
    onChange: (color: string) => void;
}

export default function GroupBadgeColor({ color: value, onChange }: GroupBadgeColorProps) {
    return (
        <FlexLayout gap={1} direction="row" style={{
            flexWrap: "wrap"
        }}>
            {colors.map((color) => (
                <div key={color} style={{
                    display: "flex",

                    background: color,

                    borderWidth: 1,
                    borderStyle: "solid",
                    borderColor: "#000000",
                    borderRadius: 3,

                    width: 13,
                    height: 13,

                    cursor: "pointer"
                }} onClick={() => onChange(color)}>
                    <div style={{
                        display: "flex",

                        flex: 1,

                        borderWidth: (value === color)?(1):(1),
                        borderStyle: "solid",
                        borderColor: (value === color)?("#FFFFFF"):("rgba(255, 255, 255, 0.5)"),
                        borderRadius: 3,
                    }}>
                        {(value === color) && (
                            <div style={{
                                flex: 1,

                                borderRadius: 10,

                                borderWidth: 2,
                                borderStyle: "solid",
                                borderColor: "#000000"
                            }}/>
                        )}
                    </div>
                </div>
            ))}
        </FlexLayout>
    );
}