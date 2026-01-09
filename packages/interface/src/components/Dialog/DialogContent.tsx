import { PropsWithChildren } from "react";

export default function DialogContent({ children }: PropsWithChildren) {
    return (
        <div style={{
            flex: 1,

            border: "2px solid white",
            borderBottomLeftRadius: 6,
            borderBottomRightRadius: 6,
            borderTop: "none",

            color: "black",
            fontSize: 13,
            padding: 10
        }}>
            {children}
        </div>
    );
}
