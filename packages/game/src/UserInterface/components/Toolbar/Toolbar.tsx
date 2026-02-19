import ToolbarFigureItem from "./Items/ToolbarFigureItem";
import ToolbarItem from "./Items/ToolbarItem";
import { useRoomInstance } from "../../hooks/useRoomInstance";
import { webSocketClient } from "../../..";
import ToolbarChatbar from "./Chatbar/ToolbarChatbar";
import { useDialogs } from "../../hooks/useDialogs";
import ToolbarToggle from "./ToolbarToggle";
import { useState } from "react";
import { useUser } from "../../hooks/useUser";

export default function Toolbar() {
    const user = useUser();
    const room = useRoomInstance();

    const { addUniqueDialog } = useDialogs();

    const [minimized, setMinimized] = useState(false);

    return (
        <div style={{
            position: "absolute",
            
            left: 0,
            bottom: 0,

            width: "100%",
            height: 47,

            background: "rgba(28, 28, 26, .9)",

            borderTop: "2px solid rgba(64, 64, 64, .75)",
            borderBottom: "1px solid rgba(64, 64, 64, .75)",
            
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",

            pointerEvents: "auto"
        }}>
            <div style={{
                display: "flex",
                flexDirection: "row",
                gap: 14,
                alignItems: "center"
            }}>
                <ToolbarToggle toggled={minimized} onToggle={setMinimized}/>

                {(!minimized) && (
                    (room)?(
                        <ToolbarItem onClick={() => webSocketClient.send("LeaveRoomEvent", null)}>
                            <div className="sprite_toolbar_logo"/>
                        </ToolbarItem>
                    ):(
                        (user?.homeRoomId) && (
                            <ToolbarItem onClick={() => webSocketClient.send("EnterHomeRoomEvent", null)}>
                                <div className="sprite_toolbar_home"/>
                            </ToolbarItem>
                        )
                    )
                )}

                {(!minimized) && (
                    <ToolbarItem onClick={() => addUniqueDialog("navigator")}>
                        <div className="sprite_toolbar_navigator"/>
                    </ToolbarItem>
                )}

                <ToolbarItem onClick={() => addUniqueDialog("shop")}>
                    <div className="sprite_toolbar_shop"/>
                </ToolbarItem>

                {(room) && (
                    <ToolbarItem onClick={() => addUniqueDialog("inventory")}>
                        <div id="toolbar-inventory" className="sprite_toolbar_inventory"/>
                    </ToolbarItem>
                )}

                {(room) && (
                    <ToolbarItem onClick={() => addUniqueDialog("wardrobe")}>
                        <ToolbarFigureItem/>
                    </ToolbarItem>
                )}
            </div>

            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}>
                {(room) && (
                    <ToolbarChatbar/>
                )}
            </div>
        </div>
    );
}
