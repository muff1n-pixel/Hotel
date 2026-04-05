import { CSSProperties, ReactNode } from "react";
import "./TraxDialogListPanel.css";

export type TraxDialogListPanelProps = {
    children?: ReactNode;
    style?: CSSProperties;
}

export default function TraxDialogListPanel({ children, style }: TraxDialogListPanelProps) {
    return (
        <div className="trax-dialog-list-panel" style={style}>
            {children}
        </div>
    );
}
