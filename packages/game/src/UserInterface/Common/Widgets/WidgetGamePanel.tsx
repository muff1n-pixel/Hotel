import FlexLayout from "@UserInterface/Common/Layouts/FlexLayout";
import { ReactNode } from "react";

export type WidgetPanelProps = {
    title: string;
    children?: ReactNode;
}

export default function WidgetPanel({ title, children }: WidgetPanelProps) {
    return (
        <div style={{
            borderRadius: 6,

            pointerEvents: "auto",

            border: "2px solid rgba(61, 61, 61, .95)",
            background: "rgba(0, 0, 0, 0.64)",

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
                background: "rgba(61, 61, 61, .95)",
                fontSize: 13,

                textAlign: "center",

                position: "relative"
            }}>
                <b>{title}</b>
            </div>

            <FlexLayout direction="row" style={{
                padding: 8,
            }}>
                {children}
            </FlexLayout>
        </div>
    );
}
