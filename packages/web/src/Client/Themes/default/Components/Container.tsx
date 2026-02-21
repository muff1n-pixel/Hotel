import { CSSProperties, PropsWithChildren } from "react";

export type ContainerProps = PropsWithChildren & {
    className?: string;
    style?: CSSProperties;
}

export default function Container({ className, style, children }: ContainerProps) {
    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            boxSizing: "border-box",
            padding: "0 24px"
        }}>
            <div className={className} style={{
                width: "100%",
                maxWidth: 1100,
                ...style
            }}>
                {children}
            </div>
        </div>
    );
}
