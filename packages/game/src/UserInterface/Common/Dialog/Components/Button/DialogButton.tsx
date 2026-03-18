import { CSSProperties, ReactNode } from "react";

import "./DialogButton.css";

export type DialogButtonProps = {
    disabled?: boolean;
    children: ReactNode;
    style?: CSSProperties;
    color?: "default" | "green";
    onClick?: () => void;
};

export default function DialogButton({ disabled, color, style, children, onClick }: DialogButtonProps) {
    return (
        <div className={`dialog-button ${(disabled)?("disabled"):("")} ${(color)?(`dialog-button-${color}`):("")}`} style={style} onClick={() => (!disabled) && onClick?.()}>
            <div className="dialog-button-content">
                {children}
            </div>
        </div>
    );
}
