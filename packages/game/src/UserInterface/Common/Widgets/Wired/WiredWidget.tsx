import { ReactNode } from "react";

const wiredWidgetBackground = new URL('../../../Images/widget/wired_background.png', import.meta.url).toString();

export type WiredWidgetProps = {
    title?: string;

    children?: ReactNode;
}

export default function WiredWidget({ title = "Wired", children }: WiredWidgetProps) {
    return (
        <div style={{
            borderRadius: 6,

            pointerEvents: "auto",

            border: "2px solid rgba(29, 47, 67, .95)",
            background: `rgba(52, 83, 118, 0.9) url(${wiredWidgetBackground})`,
            backgroundPosition: "left bottom",
            backgroundRepeat: "no-repeat",

            width: 220,
            boxSizing: "border-box",

            alignSelf: "flex-end",

            fontSize: 12,
            color: "white",

            display: "flex",
            flexDirection: "column"
        }}>
            <div style={{
                padding: "5px 8px 8px",
                background: "rgba(30, 48, 68, .95)",
                fontSize: 13,

                textAlign: "center",

                position: "relative"
            }}>
                <b>{title}</b>
            </div>

            {children}
        </div>
    );
}
