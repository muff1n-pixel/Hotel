import { CSSProperties, ReactNode } from "react";

import "./DialogButton.css";

export type DialogButtonProps = {
    disabled?: boolean;
    children: ReactNode;
    style?: CSSProperties;
    onClick?: () => void;
};

export default function DialogButton({ disabled, style, children, onClick }: DialogButtonProps) {
    return (
        <div className={`dialog-button ${(disabled)?("disabled"):("")}`} style={style} onClick={() => (!disabled) && onClick?.()}>
            <div className="dialog-button-content">
                {children}
            </div>
        </div>
    );
}
