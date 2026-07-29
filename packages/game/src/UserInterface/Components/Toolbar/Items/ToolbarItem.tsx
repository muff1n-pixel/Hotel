import { MouseEventHandler, PropsWithChildren, ReactNode } from "react";
import "./ToolbarItem.css";

export type ToolbarItemProps = PropsWithChildren & {
    toolbarTab?: string;
    tooltip?: string;
    onClick?: MouseEventHandler<HTMLDivElement>;
    notification?: ReactNode;
}

export default function ToolbarItem({ toolbarTab, tooltip, children, notification, onClick }: ToolbarItemProps) {
    return (
        <div className="toolbar-item" onClick={onClick} data-tooltip={tooltip} data-toolbar-tab={toolbarTab} style={{
            position: "relative"
        }}>
            {children}

            <div style={{
                position: "absolute",
                right: 0,
                top: 0,

                transform: "translateX(50%)"
            }}>
                {notification}
            </div>
        </div>
    );
}
