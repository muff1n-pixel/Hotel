import { MouseEventHandler, PropsWithChildren } from "react";
import "./ToolbarItem.css";

export type ToolbarItemProps = PropsWithChildren & {
    tooltip?: string;
    onClick?: MouseEventHandler<HTMLDivElement>;
}

export default function ToolbarItem({ tooltip, children, onClick }: ToolbarItemProps) {
    return (
        <div className="toolbar-item" onClick={onClick} data-tooltip={tooltip}>
            {children}
        </div>
    );
}
