import { useState } from "react";
import FriendsPanel from "src/UserInterface/Common/Friends/Components/FriendsPanel";
import ToolbarItem from "src/UserInterface/Components/Toolbar/Items/ToolbarItem";
import ToolbarToggle from "src/UserInterface/Components/Toolbar/ToolbarToggle";
import { useUser } from "src/UserInterface/Hooks/useUser";

export default function ToolbarFriends() {
    const user = useUser();
    
    const [minimized, setMinimized] = useState(false);

    return (
        <div style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            gap: 5,
            alignItems: "center",

            position: "relative"
        }}>
            <ToolbarItem onClick={() => {}}>
                <div className="sprite_friends_list"/>
            </ToolbarItem>
            
            <ToolbarItem onClick={() => {}}>
                <div className="sprite_friends_search"/>
            </ToolbarItem>

            <ToolbarItem onClick={() => {}}>
                <div className="sprite_friends_chats"/>
            </ToolbarItem>

            {(!minimized) && (
                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 8,

                    position: "relative"
                }}>
                    <FriendsPanel name={user.name} figureConfiguration={user.figureConfiguration}/>
                    
                    <FriendsPanel name={user.name} figureConfiguration={user.figureConfiguration} roomId="123"/>

                    <FriendsPanel/>
                </div>
            )}
            
            <ToolbarToggle toggled={minimized} onToggle={setMinimized} style={{
                transform: "rotateZ(180deg)"
            }}/>
        </div>
    );
}