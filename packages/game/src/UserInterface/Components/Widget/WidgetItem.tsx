import { PropsWithChildren } from "react";

export type WidgetItemProps = PropsWithChildren & {
    onClick?: () => void;
}

export default function WidgetItem({ children, onClick }: WidgetItemProps) {
    return (
        <div style={{
            flex: 1,
            background: "rgba(64, 64, 64, .2)",
            borderRadius: 10,
            padding: "0 6px",
            color: "#03B9BC",
            display: "flex",
            flexDirection: "row",
            gap: 6,
            fontSize: 12,
            alignItems: "center",
            lineHeight: 1,
            cursor: (onClick)?("pointer"):("unset")
        }} onClick={onClick}>
            {children}
        </div>
    );
}
