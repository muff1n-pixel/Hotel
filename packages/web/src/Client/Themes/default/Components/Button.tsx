import { ReactNode } from "react";

import "./Button.css";

export type ButtonProps = {
    size?: "normal" | "large";
    color?: "blue" | "orange";
    children: ReactNode;
    onClick?: () => void;
}

export default function Button({ size = "normal", color = "blue", children, onClick }: ButtonProps) {
    return (
        <div className={`button button-${size} button-${color}`} onClick={onClick}>
            <div className="button-content">
                {children}
            </div>
        </div>
    );
}
