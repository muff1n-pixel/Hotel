import { CSSProperties, ReactNode } from "react";
import "./TraxDialogPanel.css";

export type TraxDialogPanelProps = {
    type?: "full" | "top-off" | "bottom-off";

    children?: ReactNode;
    style?: CSSProperties;
    containerStyle?: CSSProperties;
}

export default function TraxDialogPanel({ type = "full", children, containerStyle, style }: TraxDialogPanelProps) {
    return (
        <div className={`trax-dialog-panel trax-dialog-panel-${type}`} style={containerStyle}>
            <div className="trax-dialog-panel-content" style={style}>
                {children}
            </div>
        </div>
    );
}
