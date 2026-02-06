import { useState } from "react";
import ToolbarToggle from "../../Toolbar/ToolbarToggle";
import ToolbarRoomInfoButton from "./Button/ToolbarRoomInfoButton";
import { useDialogs } from "../../../hooks/useDialogs";
import { useRoomInstance } from "../../../hooks/useRoomInstance";

export default function ToolbarRoomInfo() {
    const room = useRoomInstance();

    const { addUniqueDialog } = useDialogs();

    const [minimized, setMinimized] = useState(false);
    
    return (
        <div style={{
            position: "absolute",
            left: 0,
            bottom: 58
        }}>
            <div style={{
                minWidth: 150,
                position: "relative"
            }}>
                <div style={{
                    padding: 8,
                    paddingLeft: 26,

                    background: "rgba(28, 28, 26, .9)",

                    fontSize: 12,
                    color: "#9A9A99",

                    borderTopRightRadius: 6,
                    borderBottomRightRadius: 6,

                    transform: (minimized)?("translateX(-100%) translateX(16px)"):("translateX(0)"),
                    transition: "transform 0.5s",
    
                    pointerEvents: "auto"
                }}>
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 5
                    }}>
                        {[
                            {
                                sprite: "sprite_toolbar_room_information",
                                label: "Information",
                                onClick: () => {
                                    addUniqueDialog("room-information");
                                }
                            },
                            {
                                sprite: "sprite_toolbar_room_settings",
                                label: "Settings",
                                onClick: () => {
                                    addUniqueDialog("room-settings");
                                }
                            },
                            {
                                sprite: "sprite_toolbar_room_zoom",
                                label: "Zoom",
                                onClick: () => {
                                    if(room?.roomRenderer.size === 64) {
                                        room.roomRenderer.size = 32;
                                    }
                                    else if(room?.roomRenderer.size === 32) {
                                        room.roomRenderer.size = 64;
                                    }
                                }
                            },
                            {
                                sprite: "sprite_toolbar_room_chat",
                                label: "Chat history",
                                onClick: () => {
                                    
                                }
                            },
                            {
                                sprite: "sprite_toolbar_room_link",
                                label: "Link to room",
                                onClick: () => {
                                    
                                }
                            }
                        ].map((button, index) => (
                            <ToolbarRoomInfoButton key={index} sprite={button.sprite} label={button.label} onClick={button.onClick}/>
                        ))}
                    </div>
                </div>

                <div style={{
                    position: "absolute",
                    left: 0,
                    top: 0,

                    height: "100%",
    
                    pointerEvents: "auto"
                }}>
                    <ToolbarToggle toggled={minimized} onToggle={setMinimized}/>
                </div>
            </div>
        </div>
    );
}
