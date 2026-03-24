import { EnterRoomData, LeaveRoomData } from "@pixel63/events";
import ToolbarFigureItem from "@UserInterface/Components/Toolbar/Items/ToolbarFigureItem";
import ToolbarItem from "@UserInterface/Components/Toolbar/Items/ToolbarItem";
import ToolbarTab from "@UserInterface/Components/Toolbar/ToolbarTab";
import ToolbarToggle from "@UserInterface/Components/Toolbar/ToolbarToggle";
import { useDialogs } from "@UserInterface/Hooks/useDialogs";
import { useRoomInstance } from "@UserInterface/Hooks/useRoomInstance";
import { useUser } from "@UserInterface/Hooks/useUser";
import { useEffect, useState } from "react";
import { webSocketClient } from "src";

export default function ToolbarLinks() {
    const user = useUser();
    const room = useRoomInstance();

    const { addUniqueDialog } = useDialogs();

    const [minimized, setMinimized] = useState(false);
    const [tab, setTab] = useState<"me">();
    
    useEffect(() => {
        if(!tab) {
            return;
        }

        const listener = (event: MouseEvent) => {
            if(!(event.target as HTMLElement).closest(".toolbar-tab") && !(event.target as HTMLElement).closest(`[data-toolbar-tab="${tab}"]`)) {
                setTab(undefined);
            }
        };

        document.addEventListener("click", listener);

        return () => {
            document.removeEventListener("click", listener);
        };
    }, [tab]);

    return (
        <div style={{
            display: "flex",
            flexDirection: "row",
            gap: 14,
            alignItems: "center"
        }}>
            <ToolbarToggle toggled={minimized} onToggle={setMinimized}/>

            {(!minimized) && (
                (room)?(
                    <ToolbarItem onClick={() => webSocketClient.sendProtobuff(LeaveRoomData, LeaveRoomData.create({}))} tooltip="Reception">
                        <div className="sprite_toolbar_logo"/>
                    </ToolbarItem>
                ):(
                    (user?.homeRoomId) && (
                        <ToolbarItem onClick={() => webSocketClient.sendProtobuff(EnterRoomData, EnterRoomData.create({ id: user.homeRoomId }))} tooltip="Homeroom">
                            <div className="sprite_toolbar_home"/>
                        </ToolbarItem>
                    )
                )
            )}

            {(!minimized) && (
                <ToolbarItem onClick={() => addUniqueDialog("navigator")} tooltip="Navigator">
                    <div className="sprite_toolbar_navigator"/>
                </ToolbarItem>
            )}

            <ToolbarItem onClick={() => addUniqueDialog("shop")} tooltip="Shop">
                <div className="sprite_toolbar_shop"/>
            </ToolbarItem>

            {(room) && (
                <ToolbarItem onClick={() => addUniqueDialog("inventory")} tooltip="Inventory">
                    <div id="toolbar-inventory" className="sprite_toolbar_inventory"/>
                </ToolbarItem>
            )}

            {(room) && (
                <ToolbarItem toolbarTab="me" onClick={() => setTab((tab === "me")?(undefined):("me"))}>
                    <ToolbarFigureItem/>
                </ToolbarItem>
            )}

            {(tab === "me") && (
                <ToolbarTab
                    items={[
                        {
                            spriteClass: "sprite_toolbar_me_clothing",
                            onClick: () => {
                                addUniqueDialog("wardrobe");
                                setTab(undefined);
                            },
                            tooltip: "Wardrobe"
                        },
                        {
                            spriteClass: "sprite_toolbar_me_achievements",
                            onClick: () => {
                                addUniqueDialog("achievements");
                                setTab(undefined);
                            },
                            tooltip: "Achievements"
                        }
                    ]}/>
            )}
        </div>
    );
}
