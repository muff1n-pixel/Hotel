import { PropsWithChildren } from "react";

export type DialogItemProps = PropsWithChildren & {
    width?: number;
    height?: number;

    active?: boolean;
    onClick?: () => void;
    onMouseDown?: () => void;
};

export default function DialogItem({ width = 40, height = width, active, onClick, onMouseDown, children }: DialogItemProps) {
    return (
        <div style={{
            display: "flex",

            width,
            height,

            border: "1px solid black",
            borderRadius: 6,

            cursor: "pointer",

            position: "relative"
        }} onClick={onClick} onMouseDown={onMouseDown}>
            <div style={{
                flex: 1,

                border: (active)?("2px solid white"):("2px solid transparent"),
                borderRadius: 6,
                boxSizing: "border-box",

                background: "#CBCBCB",

                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}>
                {children}
            </div>
        </div>
    );
}