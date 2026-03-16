import { CSSProperties, PropsWithChildren, RefObject } from "react";
import "./DialogPanel.css";

export type DialogPanelProps = PropsWithChildren & {
    ref?: RefObject<HTMLDivElement | null>;
    style?: CSSProperties;
    contentStyle?: CSSProperties;
    color?: "silver" | "green" | "light-blue" | "beige";
    onClick?: () => void;
    arrow?: boolean;
}

export default function DialogPanel({ ref, style, onClick, contentStyle, children, color = "silver", arrow }: DialogPanelProps) {
    return (
        <div ref={ref} className={[(onClick)?("dialog-panel-clickable"):(false), `dialog-panel-${color}`, (arrow)?("dialog-panel-arrow"):(false)].map((value) => value).join(' ')} style={{
            display: "flex",

            borderWidth: 1,
            borderStyle: "solid",
            borderBottomWidth: 2,
            borderRadius: 5,

            color: "#000000",

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
