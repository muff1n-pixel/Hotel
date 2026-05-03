import { CSSProperties, MouseEvent, ReactNode } from "react";

import "./DialogButton.css";

export type DialogButtonProps = {
    disabled?: boolean;
    children: ReactNode;
    style?: CSSProperties;
    color?: "default" | "green" | "red";
    onClick?: (event?: MouseEvent) => void;
};

export default function DialogButton({ disabled, color, style, children, onClick }: DialogButtonProps) {
    return (
        <div className={`dialog-button ${(disabled)?("disabled"):("")} ${(color)?(`dialog-button-${color}`):("")}`} style={style} onClick={(event) => (!disabled) && onClick?.(event)}>
            <div className="dialog-button-content">
                {children}
            </div>
        </div>
    );
}
