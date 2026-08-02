import { ReactNode } from "react";

export type WidgetPanelProps = {
    header: ReactNode;
    children?: ReactNode;
}

export default function WidgetPanel({ header, children }: WidgetPanelProps) {
    return (
        <div style={{
            borderRadius: 6,

            pointerEvents: "auto",

            border: "2px solid rgba(109, 109, 109, 0.9)",
            background: "rgba(39, 39, 39, 0.8)",

            width: 220,
            boxSizing: "border-box",

            alignSelf: "flex-end",

            fontSize: 12,
            color: "white",

            display: "flex",
            flexDirection: "column"
        }}>
            <div style={{
                padding: (children)?("5px 8px 8px"):("2px 5px"),
                background: "rgba(109, 109, 109, 0.9)",
                fontSize: 13,

                textAlign: "center",

                position: "relative"
            }}>
                {header}
            </div>

            {children}
        </div>
    );
}
