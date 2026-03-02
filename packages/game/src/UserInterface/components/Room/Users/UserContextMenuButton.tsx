import "./UserContextMenuButton.css";

export type UserContextMenuButtonProps = {
    text: string;
    onClick: () => void;
    hasDropdown?: boolean;
    hasBack?: boolean;
};

export default function UserContextMenuButton({ hasBack, hasDropdown, text, onClick }: UserContextMenuButtonProps) {
    return (
        <div className="button" style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",

            height: 26,
            maxWidth: 100,

            cursor: "pointer",

            padding: "5px 6px",
            boxSizing: "border-box",

            position: "relative"
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
