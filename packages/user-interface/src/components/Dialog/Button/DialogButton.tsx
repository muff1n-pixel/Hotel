import { CSSProperties, ReactNode } from "react";

import "./DialogButton.css";

export type DialogButtonProps = {
    children: ReactNode;
    style?: CSSProperties;
};

export default function DialogButton({ style, children }: DialogButtonProps) {
    return (
        <div className="dialog-button" style={style}>
            <div className="dialog-button-content">
                {children}
            </div>
        </div>
    );
}
