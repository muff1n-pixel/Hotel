import { CSSProperties, PropsWithChildren } from "react";

export type DialogPanelProps = PropsWithChildren & {
    style?: CSSProperties;
    contentStyle?: CSSProperties;
}

export default function DialogPanel({ style, contentStyle, children }: DialogPanelProps) {
    return (
        <div style={{
            display: "flex",

            border: "1px solid #757571",
            borderBottomWidth: 2,
            borderRadius: 5,

            ...style
        }}>
            <div style={{
                flex: 1,

                background: "#D2D1CB",
                border: "2px solid #F4F4F0",
                borderRadius: 5,

                ...contentStyle
            }}>
                {children}
            </div>
        </div>
    );
}
