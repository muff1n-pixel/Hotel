import { CSSProperties, PropsWithChildren } from "react";

export type DialogContentProps = PropsWithChildren & {
    style?: CSSProperties;
};

export default function DialogContent({ style, children }: DialogContentProps) {
    return (
        <div style={{
            flex: 1,

            border: "2px solid white",
            borderBottomLeftRadius: 6,
            borderBottomRightRadius: 6,
            borderTop: "none",

            display: "flex",
            flexDirection: "column",

            color: "black",
            fontSize: 13,
            padding: 10,

            ...style
        }}>
            {children}
        </div>
    );
}
