import { ReactNode } from "react";
import "./WiredWidgetButton.css";

export type WiredWidgetButtonProps = {
    children?: ReactNode;
    onClick?: () => void;
}

export default function WiredWidgetButton({ children, onClick }: WiredWidgetButtonProps) {
    return (
        <div className="wired-widget-button" onClick={onClick}>
            {children}
        </div>
    );
}
