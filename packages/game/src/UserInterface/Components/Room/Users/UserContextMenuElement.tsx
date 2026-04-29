import { PropsWithChildren } from "react";

import "./UserContextMenuElement.css";

export type UserContextMenuElementProps = PropsWithChildren & {
    position: "top" | "bottom";
    hideBorder?: boolean;
    onClick?: () => void;
};

export default function UserContextMenuElement({ position, children, onClick, hideBorder }: UserContextMenuElementProps) {
    return (
        <div onClick={onClick} className="user-context-menu-element" style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",

            cursor: "pointer",

            height: 26,
            borderTop: (!hideBorder && position === "bottom")?("1px solid black"):(undefined),
            borderBottom: (!hideBorder && position === "top")?("1px solid black"):(undefined),

            borderTopLeftRadius: (position === "top")?(5):(undefined),
            borderTopRightRadius: (position === "top")?(5):(undefined),

            borderBottomLeftRadius: (position === "bottom")?(5):(undefined),
            borderBottomRightRadius: (position === "bottom")?(5):(undefined),

            padding: "5px 12px",
            boxSizing: "border-box"
        }}>
            {children}
        </div>
    );
}
