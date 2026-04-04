import { ReactNode } from "react";
import "./TraxButton.css";

export type TraxButtonProps = {
    children?: ReactNode;
    type?: "full" | "bottom-off";
    onClick?: () => void;
    disabled?: boolean;
}

export default function TraxButton({ type = "full", disabled, children, onClick }: TraxButtonProps) {
    return (
        <div className={`trax-button trax-button-${type} ${(disabled)?("trax-button-disabled"):("")}`} onClick={onClick}>
            <div className="trax-button-content">
                {children}
            </div>
        </div>
    );
}
