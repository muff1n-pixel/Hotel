import { useState } from "react";
import ToolbarToggle from "../../Toolbar/ToolbarToggle";
import ToolbarRoomInfoButton from "./Button/ToolbarRoomInfoButton";
import { useDialogs } from "../../../Hooks/useDialogs";
import { useRoomInstance } from "../../../Hooks/useRoomInstance";
import ToolbarRoomChat from "./ToolbarRoomChat";
import { useTranslation } from "react-i18next";
import { useRoomScale } from "@UserInterface/Hooks/useRoomScale";

export default function ToolbarRoomInfo() {
    const [getTranslation] = useTranslation("room");
    
    const room = useRoomInstance();
    const roomScale = useRoomScale();

    const { addUniqueDialog } = useDialogs();

    const [minimized, setMinimized] = useState(false);
    const [chatMinimized, setChatMinimized] = useState(true);
   
    if(!room) {
        return null;
    }

    return (
        <div style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 50,

            paddingBottom: 8,

            display: "flex",
            flexDirection: "column",
        }}>
            <ToolbarRoomChat minimized={chatMinimized} onMinimized={setChatMinimized}/>

            <div style={{
                minWidth: 150,
                width: "max-content",
                position: "relative"
            }}>
                <div style={{
                    padding: 8,
                    paddingLeft: 26,

                    background: "rgba(32, 32, 27, 0.84)",

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
                                label: getTranslation("toolbar.information"),
                                onClick: () => {
                                    addUniqueDialog("room-information");
                                }
                            },
                            {
                                sprite: "sprite_toolbar_room_settings",
                                label: getTranslation("toolbar.settings"),
                                onClick: () => {
                                    addUniqueDialog("room-settings");
                                },
                                disabled: room.hasRights === false
                            },
                            {
                                sprite: (roomScale !== 1)?("sprite_toolbar_room_zoom-out"):("sprite_toolbar_room_zoom-in"),
                                label: getTranslation("toolbar.zoom"),
                                onClick: () => {
                                    switch(roomScale) {
                                        case 0.5: {
                                            room.roomRenderer.scale.value = 1;

                                            break;
                                        }

                                        case 1: 
                                        default: {
                                            room.roomRenderer.scale.value = 2;

                                            break;
                                        }

                                        case 2: {
                                            room.roomRenderer.scale.value = 0.5;

                                            break;
                                        }
                                    }
                                }
                            },
                            {
                                sprite: "sprite_toolbar_room_chat",
                                label: getTranslation("toolbar.chat_history"),
                                onClick: () => {
                                    setChatMinimized(!chatMinimized);
                                }
                            },
                            {
                                sprite: "sprite_toolbar_room_link",
                                label: getTranslation("toolbar.link"),
                                onClick: () => {
                                    
                                }
                            }
                        ].map((button, index) => (!button.disabled) && (
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
