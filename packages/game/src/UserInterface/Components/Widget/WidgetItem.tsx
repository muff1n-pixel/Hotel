import { CSSProperties, PropsWithChildren } from "react";

export type WidgetItemProps = PropsWithChildren & {
    style?: CSSProperties;
    onClick?: () => void;
}

export default function WidgetItem({ style, children, onClick }: WidgetItemProps) {
    return (
        <div style={{
            flex: 1,
            background: "rgba(55, 53, 48, 0.92) ",
            borderRadius: 10,
            padding: "0 6px",
            color: "#03B9BC",
            display: "flex",
            flexDirection: "row",
            gap: 6,
            fontSize: 12,
            alignItems: "center",
            justifyContent: "center",
            lineHeight: 1,
            cursor: (onClick)?("pointer"):("unset"),
            ...style
        }} onClick={onClick}>
            {children}
        </div>
    );
}
