import { CSSProperties, MouseEvent, ReactNode } from "react";

import "./DialogButton.css";

export type DialogButtonProps = {
    disabled?: boolean;
    children: ReactNode;
    style?: CSSProperties;
    contentStyle?: CSSProperties;
    color?: "default" | "green" | "red" | "blue";
    onClick?: (event?: MouseEvent) => void;
};

export default function DialogButton({ disabled, color, style, contentStyle, children, onClick }: DialogButtonProps) {
    return (
        <div className={`dialog-button ${(disabled)?("disabled"):("")} ${(color)?(`dialog-button-${color}`):("")}`} style={style} onClick={(event) => (!disabled) && onClick?.(event)}>
            <div className="dialog-button-content" style={contentStyle}>
                {children}
            </div>
        </div>
    );
}
