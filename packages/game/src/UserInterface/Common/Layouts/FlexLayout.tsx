import { CSSProperties, ReactNode } from "react";

export type FlexLayoutProps = {
    ref?: React.RefObject<HTMLDivElement | null>;
    className?: string;
    direction?: "row" | "column";
    gap?: number;
    align?: string;
    justify?: string;
    flex?: number;
    style?: CSSProperties;

    children?: ReactNode;
    onClick?: () => void;
}

export default function FlexLayout({ ref, className, style, flex, direction: flexDirection = "column", gap = 10, children, align: alignItems, justify: justifyContent, onClick }: FlexLayoutProps) {
    return (
        <div ref={ref} className={className} onClick={onClick} style={{
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