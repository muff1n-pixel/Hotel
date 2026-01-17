import ClientFigureDataResponse from "@Shared/events/responses/ClientFigureDataResponse";
import { PropsWithChildren } from "react";

export type WardrobeSelectionColorsProps = PropsWithChildren & {
    disabled: boolean;
    colors?: ClientFigureDataResponse["colors"];
    activeColor: number | undefined;
    onColorChange: (color: number) => void;
};

export default function WardrobeSelectionColors({ disabled, colors, activeColor, onColorChange }: WardrobeSelectionColorsProps) {
    return (
        <div style={{
            height: 94,

            overflowY: (!disabled)?("overlay"):("hidden"),
            opacity: (!disabled)?(1):(0.5),
            pointerEvents: (!disabled)?("auto"):("none"),

            paddingTop: 2,
        }}>
            <div style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 2,
                rowGap: 4,
            }}>
                {colors?.map(({ id, color }) => (
                    <div key={id} style={{
                        backgroundColor: "#24221D",
                        borderRadius: 3,
                        paddingBottom: (activeColor === id)?(4):(2),
                        marginTop: (activeColor === id)?(-2):(0),
                        cursor: "pointer"
                    }} onClick={() => onColorChange(id)}>
                        <div style={{
                            border: `2px solid ${(activeColor === id)?("#A69D95"):("#736D67")}`,
                            borderRadius: 3,
                            background: `#${color}`
                        }}>
                            <div style={{
                                width: 9,
                                height: 13,

                                borderBottom: "1px solid rgba(0, 0, 0, .1)",

                                display: "flex"
                            }}>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
