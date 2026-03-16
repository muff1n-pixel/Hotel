import { PropsWithChildren } from "react";

import "./WidgetButton.css";

export type WidgetButtonProps = PropsWithChildren & {
    tooltip?: string;
    disabled?: boolean;
    color: string;
    onClick: () => void;
}

export default function WidgetButton({ tooltip, disabled, color, children, onClick }: WidgetButtonProps) {
    return (
        <div className={`widget-button ${(disabled)?("disabled"):("")}`} data-tooltip={tooltip} style={{
            background: color
        }} onClick={onClick}>
            {children}
        </div>
    );
}
