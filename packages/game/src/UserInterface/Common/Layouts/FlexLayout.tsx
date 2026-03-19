import { CSSProperties, ReactNode } from "react";

export type FlexLayoutProps = {
    direction?: "row" | "column";
    gap?: number;
    align?: string;
    justify?: string;
    flex?: number;
    style?: CSSProperties;

    children?: ReactNode;
}

export default function FlexLayout({ style, flex, direction: flexDirection = "column", gap = 10, children, align: alignItems, justify: justifyContent }: FlexLayoutProps) {
    return (
        <div style={{
            flex,

            display: "flex",
            flexDirection,
            gap,

            justifyContent,
            alignItems,

            ...style
        }}>
            {children}
        </div>
    );
}