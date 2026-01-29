import { useContext } from "react";
import ToolbarFigureItem from "./Items/ToolbarFigureItem";
import ToolbarItem from "./Items/ToolbarItem";
import { AppContext } from "../../contexts/AppContext";
import WardrobeDialog from "../Wardrobe/WardrobeDialog";
import { useRoomInstance } from "../../hooks/useRoomInstance";
import { webSocketClient } from "../../..";
import ToolbarChatbar from "./Chatbar/ToolbarChatbar";
import { useDialogs } from "../../hooks/useDialogs";

export default function Toolbar() {
    const room = useRoomInstance();

    const { addUniqueDialog } = useDialogs();

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
                <div/>

                {(room)?(
                    <ToolbarItem onClick={() => webSocketClient.send("LeaveRoomEvent", null)}>
                        <ToolbarItem>
                            <div className="sprite_toolbar_logo"/>
                        </ToolbarItem>
                    </ToolbarItem>
                ):(
                    <ToolbarItem onClick={() => webSocketClient.send("EnterHomeRoomEvent", null)}>
                        <ToolbarItem>
                            <div className="sprite_toolbar_home"/>
                        </ToolbarItem>
                    </ToolbarItem>
                )}

                <ToolbarItem onClick={() => addUniqueDialog("navigator")}>
                    <ToolbarItem>
                        <div className="sprite_toolbar_navigator"/>
                    </ToolbarItem>
                </ToolbarItem>

                <ToolbarItem onClick={() => addUniqueDialog("shop")}>
                    <ToolbarItem>
                        <div className="sprite_toolbar_shop"/>
                    </ToolbarItem>
                </ToolbarItem>

                {(room) && (
                    <ToolbarItem onClick={() => addUniqueDialog("inventory")}>
                        <ToolbarItem>
                            <div className="sprite_toolbar_inventory"/>
                        </ToolbarItem>
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
                <ToolbarChatbar/>
            </div>
        </div>
    );
}
