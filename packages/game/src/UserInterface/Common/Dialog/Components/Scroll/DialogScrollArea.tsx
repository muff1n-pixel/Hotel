import { CSSProperties, ReactNode, useRef } from "react";
import DialogScrollbar from "./DialogScrollbar";

export type DialogScrollAreaProps = {
    children?: ReactNode;
    style?: CSSProperties;
    contentStyle?: CSSProperties;
    hideInactive?: boolean;
};

export default function DialogScrollArea({ style, contentStyle, children, hideInactive }: DialogScrollAreaProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    return (
        <div style={{
            flex: "1 1 0",

            display: "flex",
            flexDirection: "row",
            gap: 1,

            overflow: "hidden",

            ...style
        }}>
            <div ref={containerRef} style={{
                flex: "1 1 0",
                overflowY: "scroll",

                ...contentStyle
            }}>
                {children}
            </div>

            <DialogScrollbar containerRef={containerRef} hideInactive={hideInactive}/>
        </div>
    );
}
