import { CSSProperties, PropsWithChildren } from "react";
import "./DialogPanel.css";

export type DialogPanelProps = PropsWithChildren & {
    style?: CSSProperties;
    contentStyle?: CSSProperties;
    color?: "silver" | "green" | "light-blue";
    onClick?: () => void;
}

export default function DialogPanel({ style, onClick, contentStyle, children, color = "silver" }: DialogPanelProps) {
    return (
        <div className={[(onClick)?("dialog-panel-clickable"):(false), `dialog-panel-${color}`].map((value) => value).join(' ')} style={{
            display: "flex",

            borderWidth: 1,
            borderStyle: "solid",
            borderBottomWidth: 2,
            borderRadius: 5,

            ...style
        }}>
            <div style={{
                flex: 1,

                borderWidth: 2,
                borderStyle: "solid",
                borderRadius: 5,

                ...contentStyle
            }}>
                {children}
            </div>
        </div>
    );
}
