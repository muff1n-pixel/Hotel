import { CSSProperties } from "react";
import "./UserContextMenuButton.css";

export type UserContextMenuButtonProps = {
    text: string;
    onClick: () => void;
    hasDropdown?: boolean;
    hasBack?: boolean;
    style?: CSSProperties;
};

export default function UserContextMenuButton({ hasBack, hasDropdown, text, style, onClick }: UserContextMenuButtonProps) {
    return (
        <div className="button" style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",

            minHeight: 26,
            maxWidth: 100,

            cursor: "pointer",

            padding: "5px 6px",
            boxSizing: "border-box",

            textWrap: "wrap",
            textAlign: "center",

            position: "relative",

            ...style
        }} onClick={onClick}>
            {text}

            {(hasBack) && (
                <div className="sprite_context-menu_arrow-down" style={{
                    transform: "rotateZ(90deg)",

                    position: "absolute",
                    left: 4,
                }}/>
            )}

            {(hasDropdown) && (
                <div className="sprite_context-menu_arrow-down" style={{
                    transform: "rotateZ(-90deg)",

                    position: "absolute",
                    right: 4,
                }}/>
            )}
        </div>
    );
}
