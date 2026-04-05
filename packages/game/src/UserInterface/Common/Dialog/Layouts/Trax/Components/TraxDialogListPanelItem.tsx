import { CSSProperties, ReactNode } from "react";
import "./TraxDialogListPanelItem.css";

export type TraxDialogListPanelProps = {
    children?: ReactNode;
    style?: CSSProperties;
    active?: boolean;
}

export default function TraxDialogListPanel({ active, children }: TraxDialogListPanelProps) {
    return (
        <div className={`trax-dialog-list-panel-item ${(active)?("trax-dialog-list-panel-item-active"):("")}`}>
            {children}
        </div>
    );
}
