import "./ToolbarRoomInfoButton.css";

export type ToolbarRoomInfoButtonProps = {
    sprite: string;
    label: string;
    onClick: () => void;
};

export default function ToolbarRoomInfoButton({ sprite, label, onClick }: ToolbarRoomInfoButtonProps) {
    return (
        <div className="toolbar-room-info-button" onClick={onClick}>
            <div className="toolbar-room-info-button-sprite">
                <div className={sprite}/>
            </div>

            <div style={{
                marginTop: -4,
                textDecoration: "underline",
            }}>
                {label}
            </div>
        </div>
    );
}
