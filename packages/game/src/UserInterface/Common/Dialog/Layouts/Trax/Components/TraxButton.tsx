import { CSSProperties, ReactNode } from "react";
import "./TraxButton.css";

export type TraxButtonProps = {
    children?: ReactNode;
    type?: "full" | "bottom-off";
    onClick?: () => void;
    disabled?: boolean;
    style?: CSSProperties;
    containerStyle?: CSSProperties;
}

export default function TraxButton({ type = "full", disabled, containerStyle, style, children, onClick }: TraxButtonProps) {
    return (
        <div className={`trax-button trax-button-${type} ${(disabled)?("trax-button-disabled"):("")}`} onClick={onClick} style={containerStyle}>
            <div className="trax-button-content" style={style}>
                {children}
            </div>
        </div>
    );
}
