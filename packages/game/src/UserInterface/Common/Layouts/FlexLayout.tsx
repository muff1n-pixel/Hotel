import { CSSProperties, ReactNode } from "react";

export type FlexLayoutProps = {
    className?: string;
    direction?: "row" | "column";
    gap?: number;
    align?: string;
    justify?: string;
    flex?: number;
    style?: CSSProperties;

    children?: ReactNode;
}

export default function FlexLayout({ className, style, flex, direction: flexDirection = "column", gap = 10, children, align: alignItems, justify: justifyContent }: FlexLayoutProps) {
    return (
        <div className={className} style={{
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