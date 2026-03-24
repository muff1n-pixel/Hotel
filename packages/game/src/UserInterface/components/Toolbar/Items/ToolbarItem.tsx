import { MouseEventHandler, PropsWithChildren } from "react";
import "./ToolbarItem.css";

export type ToolbarItemProps = PropsWithChildren & {
    toolbarTab?: string;
    tooltip?: string;
    onClick?: MouseEventHandler<HTMLDivElement>;
}

export default function ToolbarItem({ toolbarTab, tooltip, children, onClick }: ToolbarItemProps) {
    return (
        <div className="toolbar-item" onClick={onClick} data-tooltip={tooltip} data-toolbar-tab={toolbarTab}>
            {children}
        </div>
    );
}
