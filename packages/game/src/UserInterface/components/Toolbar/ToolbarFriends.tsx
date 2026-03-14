import { useState } from "react";
import FriendsPanel from "src/UserInterface/Common/Friends/Components/FriendsPanel";
import ToolbarItem from "src/UserInterface/Components/Toolbar/Items/ToolbarItem";
import ToolbarToggle from "src/UserInterface/Components/Toolbar/ToolbarToggle";
import { useDialogs } from "src/UserInterface/Hooks/useDialogs";
import { useUser } from "src/UserInterface/Hooks/useUser";

export default function ToolbarFriends() {
    const user = useUser();
    const dialogs = useDialogs();

    const [minimized, setMinimized] = useState(false);

    const [expandedFriendId, setExpandedFriendId] = useState<string | null>(null);

    return (
        <div style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            gap: 5,
            alignItems: "center",

            position: "relative"
        }}>
            <ToolbarItem onClick={() => dialogs.addUniqueDialog("friends")}>
                <div className="sprite_friends_list"/>
            </ToolbarItem>
            
            <ToolbarItem onClick={() => dialogs.addUniqueDialog("friends", { tab: "search" })}>
                <div className="sprite_friends_search"/>
            </ToolbarItem>

            <ToolbarItem onClick={() => dialogs.addUniqueDialog("messenger")}>
                <div className="sprite_friends_chats"/>
            </ToolbarItem>

            {(!minimized) && (
                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 8,

                    position: "relative"
                }}>
                    <FriendsPanel expanded={"1" === expandedFriendId} onExpand={(value) => setExpandedFriendId((value)?("1"):(null))} name={user.name} figureConfiguration={user.figureConfiguration}/>
                    
                    <FriendsPanel expanded={"2" === expandedFriendId} onExpand={(value) => setExpandedFriendId((value)?("2"):(null))} name={user.name} figureConfiguration={user.figureConfiguration} roomId="123"/>

                    <FriendsPanel/>
                </div>
            )}
            
            <ToolbarToggle toggled={minimized} onToggle={setMinimized} style={{
                transform: "rotateZ(180deg)"
            }}/>
        </div>
    );
}