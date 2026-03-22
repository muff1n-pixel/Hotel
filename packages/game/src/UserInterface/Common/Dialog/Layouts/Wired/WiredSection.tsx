import { CSSProperties, PropsWithChildren } from "react";

export type WiredSectionProps = PropsWithChildren & {
    style?: CSSProperties;
}

export default function WiredSection({ children, style }: WiredSectionProps) {
    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            gap: 6,
            
            padding: 5,

            ...style
        }}>
            {children}
        </div>
    )
}