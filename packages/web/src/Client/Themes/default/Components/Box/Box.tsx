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
    color?: "blue" | "lightBlue" | "red" | "orange" | "green" | "grey";
    children: ReactNode;
    style?: React.CSSProperties;
    titleStyle?: React.CSSProperties;
    className?: string;
};

const Box = ({ title, color = "blue", children, style = {}, titleStyle, className }: BoxProps) => {
    const isString = typeof title === "string";

    const name = isString ? title : title?.name;
    const subtitle = isString ? undefined : title?.subtitle;

    return (
        <div className={["box", className].filter(Boolean).join(" ")} style={style}>
            {title && (
                <div
                    className={[
                        "title",
                        color,
                        subtitle && "flex"
                    ]
                        .filter(Boolean)
                        .join(" ")}
                    style={titleStyle}
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