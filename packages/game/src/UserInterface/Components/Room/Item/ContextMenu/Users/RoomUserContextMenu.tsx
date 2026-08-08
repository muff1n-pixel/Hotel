import RoomFigureItem from "@Client/Room/Items/Figure/RoomFigureItem";
import RoomItemContextMenuWrapper from "../RoomItemContextMenuWrapper";
import UserContextMenuElement from "../../../Users/UserContextMenuElement";
import { useEffect, useState } from "react";
import { useRoomInstance } from "../../../../../Hooks/useRoomInstance";
import { useDialogs } from "../../../../../Hooks/useDialogs";
import RoomUserContextMenuTabs from "./RoomUserContextMenuTabs";

export type RoomUserContextMenuProps = {
    item: RoomFigureItem;
};

export default function RoomUserContextMenu({ item }: RoomUserContextMenuProps) {
    const dialogs = useDialogs();
    const room = useRoomInstance();

    const [targetUser, setTargetUser] = useState(room?.users.find((user) => user.item.id === item.id));
    const [tab, setTab] = useState<string | null>(null);

    useEffect(() => {
        setTargetUser(room?.users.find((user) => user.item.id === item.id));
    }, [room, item]);

    if(!targetUser) {
        return null;
    }
    
    return (
        <RoomItemContextMenuWrapper item={item}>
            <UserContextMenuElement position="top" onClick={() => {
                dialogs.addUniqueDialog("user-profile", targetUser.data.id, targetUser.data.id);
            }}>
                {targetUser.data.name}
            </UserContextMenuElement>

            <RoomUserContextMenuTabs tab={tab} targetUser={targetUser} setTab={setTab} closeTab={() => setTab(null)} close={() => {
                if(room) {
                    room.roomRenderer.focusedItem.value = undefined;
                }
            }}/>
        </RoomItemContextMenuWrapper>
    );
}
