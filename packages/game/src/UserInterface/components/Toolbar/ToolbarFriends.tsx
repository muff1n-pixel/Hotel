import { useState } from "react";
import FriendsPanel from "src/UserInterface/Common/Friends/Components/FriendsPanel";
import ToolbarItem from "src/UserInterface/Components/Toolbar/Items/ToolbarItem";
import ToolbarToggle from "src/UserInterface/Components/Toolbar/ToolbarToggle";
import { useDialogs } from "src/UserInterface/Hooks/useDialogs";
import useFriends from "src/UserInterface/Hooks/useFriends";
import { useMessenger } from "src/UserInterface/Hooks/useMessenger";
import { useMessengerUnread } from "src/UserInterface/Hooks/useMessengerUnread";

export default function ToolbarFriends() {
    const dialogs = useDialogs();
    const messenger = useMessenger();
    const messengerUnread = useMessengerUnread();
    const { friends } = useFriends();

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

            <ToolbarItem onClick={() => (messenger.length > 0) && dialogs.addUniqueDialog("messenger")}>
                {(messenger.length > 0) && (
                    <div className={(messengerUnread)?("sprite_friends_chats-new"):("sprite_friends_chats")}/>
                )}
            </ToolbarItem>

            {(!minimized) && (
                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 8,

                    position: "relative"
                }}>
                    {friends?.slice(0, 3).map((friend) => (
                        <FriendsPanel
                            key={friend.id}
                            
                            expanded={expandedFriendId === friend.id}
                            onExpand={(value) => setExpandedFriendId((value)?(friend.id):(null))}

                            onChatClick={() => {
                                dialogs.openUniqueDialog("messenger", {
                                    friendId: friend.id
                                });
                            }}
                            name={friend.name}
                            figureConfiguration={friend.figureConfiguration}/>
                    ))}

                    {(!friends || friends.length < 3) && (
                        Array(3 - (friends?.length ?? 0)).fill(null).map((_, index) => (
                            <FriendsPanel key={index}/>
                        ))
                    )}
                </div>
            )}
            
            <ToolbarToggle toggled={minimized} onToggle={setMinimized} style={{
                transform: "rotateZ(180deg)"
            }}/>
        </div>
    );
}