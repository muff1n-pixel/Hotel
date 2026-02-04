import { useState } from "react";
import ToolbarToggle from "../../Toolbar/ToolbarToggle";

export default function ToolbarRoomInfo() {
    const [minimized, setMinimized] = useState(false);
    
    return (
        <div style={{
            position: "absolute",
            left: 0,
            bottom: 58,

            pointerEvents: "auto"
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
                    transition: "transform 0.5s"

                }}>
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 5
                    }}>
                        {[
                            {
                                sprite: "sprite_toolbar_room_settings",
                                label: "Settings"
                            },
                            {
                                sprite: "sprite_toolbar_room_zoom",
                                label: "Zoom"
                            },
                            {
                                sprite: "sprite_toolbar_room_chat",
                                label: "Chat history"
                            },
                            {
                                sprite: "sprite_toolbar_room_link",
                                label: "Link to room"
                            }
                        ].map((button, index) => (
                            <div key={index} style={{
                                display: "flex",
                                flexDirection: "row",
                                gap: 12,
                                alignItems: "center",
                                height: 24,

                                cursor: "pointer"
                            }}>
                                <div style={{
                                    width: 20,

                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center"
                                }}>
                                    <div className={button.sprite}/>
                                </div>

                                <div style={{
                                    marginTop: -4,
                                    textDecoration: "underline",
                                }}>
                                    {button.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{
                    position: "absolute",
                    left: 0,
                    top: 0,

                    height: "100%"
                }}>
                    <ToolbarToggle toggled={minimized} onToggle={setMinimized}/>
                </div>
            </div>
        </div>
    );
}
