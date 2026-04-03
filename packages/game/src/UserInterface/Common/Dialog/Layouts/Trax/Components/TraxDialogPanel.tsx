import { CSSProperties, ReactNode } from "react";
import "./TraxDialogPanel.css";

export type TraxDialogPanelProps = {
    type?: "full" | "top-off" | "bottom-off";

    children?: ReactNode;
    style?: CSSProperties;
}

export default function TraxDialogPanel({ type = "full", children, style }: TraxDialogPanelProps) {
    return (
        <div className={`trax-dialog-panel trax-dialog-panel-${type}`}>
            <div className="trax-dialog-panel-content" style={style}>
                {children}
            </div>
        </div>
    );
}
