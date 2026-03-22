import { ReactNode } from "react";
import "./Box.css";

type Title =
    | string
    | {
        name: string;
        subtitle?: string;
    };

type BoxProps = {
    title?: Title;
    color?: "blue" | "lightBlue" | "red" | "orange" | "green";
    children: ReactNode;
    style?: React.CSSProperties;
    className?: string;
};

const Box = ({ title, color = "blue", children, style = {}, className }: BoxProps) => {
    const isString = typeof title === "string";

    const name = isString ? title : title?.name;
    const subtitle = isString ? undefined : title?.subtitle;

    return (
        <div className={["box", className].filter(Boolean).join(" ")} style={style}>
            {title && (
                <div
                    className={["title", color, subtitle && "flex"]
                        .filter(Boolean)
                        .join(" ")}
                >
                    {name}
                    {subtitle && <span>{subtitle}</span>}
                </div>
            )}

            <div className="content">
                {children}
            </div>
        </div>
    );
};

export default Box;