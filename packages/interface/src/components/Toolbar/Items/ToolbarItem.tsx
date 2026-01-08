import { MouseEventHandler, PropsWithChildren, useCallback, useState } from "react";
import "./ToolbarItem.css";

export type ToolbarItemProps = PropsWithChildren & {
    onClick?: MouseEventHandler<HTMLDivElement>;
}

export default function ToolbarItem({ children, onClick }: ToolbarItemProps) {
    return (
        <div className="toolbar-item" onClick={onClick}>
            {children}
        </div>
    );
}
