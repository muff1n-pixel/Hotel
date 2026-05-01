import { CSSProperties, ReactNode } from "react";

export type WiredButtonProps = {
    children: ReactNode;
    onClick: () => void;
    style?: CSSProperties;
};

export default function WiredButton({ children, onClick, style }: WiredButtonProps) {
    return (
        <div style={{
            flex: 1,
            height: 20,
            
            border: "1px solid #FFFFFF",
            borderRadius: 4,

            display: "flex",
            justifyContent: "center",
            alignItems: "center",

            cursor: "pointer",

            ...style
        }} onClick={onClick}>
            <div>{children}</div>
        </div>
    );
}
