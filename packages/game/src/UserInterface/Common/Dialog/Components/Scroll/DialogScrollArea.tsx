import { CSSProperties, ReactNode, RefObject, useRef } from "react";
import DialogScrollbar from "./DialogScrollbar";

export type DialogScrollAreaProps = {
    ref?: RefObject<HTMLDivElement | null>;

    children?: ReactNode;
    style?: CSSProperties;
    contentStyle?: CSSProperties;
    hideInactive?: boolean;
    reversed?: boolean;
};

export default function DialogScrollArea({ ref, style, contentStyle, children, hideInactive, reversed }: DialogScrollAreaProps) {
    const containerRef = ref ?? useRef<HTMLDivElement>(null);

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

            <DialogScrollbar containerRef={containerRef} hideInactive={hideInactive} reversed={reversed}/>
        </div>
    );
}
