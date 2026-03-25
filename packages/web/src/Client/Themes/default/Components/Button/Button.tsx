import { ReactNode, forwardRef } from "react";

import "./Button.css";

export type ButtonProps = {
    size?: "small" | "normal" | "medium" | "large";
    color?: "blue" | "orange" | "green" | "grey" | "black" | "red";
    shadow?: boolean;
    children: ReactNode;
    style?: React.CSSProperties;
    onClick?: () => void;
    disabled?: boolean;
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            size = "normal",
            color = "blue",
            shadow = true,
            children,
            onClick,
            style = {},
            disabled = false
        },
        ref
    ) => {
        return (
            <button
                ref={ref}
                className={`button button-${size} button-${color} ${!shadow ? "no-shadow" : ""}`}
                style={style}
                onClick={onClick}
                disabled={disabled}
            >
                {children}
            </button>
        );
    }
);

export default Button;