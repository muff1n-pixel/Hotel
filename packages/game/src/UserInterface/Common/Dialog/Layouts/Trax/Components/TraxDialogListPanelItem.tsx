import { CSSProperties, ReactNode } from "react";
import "./TraxDialogListPanelItem.css";

export type TraxDialogListPanelProps = {
    children?: ReactNode;
    style?: CSSProperties;
    active?: boolean;
    onClick?: () => void;
    disabled?: boolean;
}

export default function TraxDialogListPanelItem({ active, disabled, children, style, onClick }: TraxDialogListPanelProps) {
    return (
        <div className={`trax-dialog-list-panel-item ${(active)?("trax-dialog-list-panel-item-active"):("")} ${(disabled)?("trax-dialog-list-panel-item-disabled"):("")}`} onClick={onClick} style={style}>
            {children}
        </div>
    );
}
