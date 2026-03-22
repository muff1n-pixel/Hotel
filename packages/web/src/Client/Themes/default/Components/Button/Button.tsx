import { ReactNode } from "react";

import "./Button.css";

export type ButtonProps = {
    size?: "small" | "normal" | "medium" | "large";
    color?: "blue" | "orange" | "green" | "grey";
    shadow?: boolean;
    children: ReactNode;
    style?: React.CSSProperties;
    onClick?: () => void;
}

export default function Button({ size = "normal", color = "blue", shadow = true, children, onClick, style = {} }: ButtonProps) {
    return (
        <button className={`button button-${size} button-${color} ${!shadow ? "no-shadow" : ""}`} style={style} onClick={onClick}>
            {children}
        </button>
    );
}
