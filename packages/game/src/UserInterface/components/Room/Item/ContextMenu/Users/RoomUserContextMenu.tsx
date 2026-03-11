import RoomFigureItem from "@Client/Room/Items/Figure/RoomFigureItem";
import RoomItemContextMenuWrapper from "../RoomItemContextMenuWrapper";
import UserContextMenuElement from "../../../Users/UserContextMenuElement";
import { Fragment, useEffect, useState } from "react";
import { useRoomInstance } from "../../../../../hooks/useRoomInstance";
import UserContextMenuList from "../../../Users/UserContextMenuList";
import { useUser } from "../../../../../hooks/useUser";
import UserContextMenuButton from "../../../Users/UserContextMenuButton";
import { useDialogs } from "../../../../../hooks/useDialogs";
import { webSocketClient } from "../../../../../..";
import { SendRoomChatMessageData, SetRoomUserRightsData } from "@pixel63/events";

export type RoomUserContextMenuProps = {
    item: RoomFigureItem;
};

export default function RoomUserContextMenu({ item }: RoomUserContextMenuProps) {
    const dialogs = useDialogs();
    const room = useRoomInstance();
    const user = useUser();

    const [targetUser, setTargetUser] = useState(room?.users.find((user) => user.item.id === item.id));
    const [tab, setTab] = useState<null | "dance">(null);

    useEffect(() => {
        setTargetUser(room?.users.find((user) => user.item.id === item.id));
    }, [room, item]);

    if(!targetUser) {
        return null;
    }
    
    return (
        <RoomItemContextMenuWrapper item={item}>
            <UserContextMenuElement position="top">
                {targetUser.data.name}
            </UserContextMenuElement>

            {(tab === null) && (
                <UserContextMenuList>
                    {(targetUser.data.id === user.id)?(
                        <Fragment>
                            <UserContextMenuButton text="Wardrobe" onClick={() => {
                                dialogs.addUniqueDialog("wardrobe");
                            }}/>
                            
                            <UserContextMenuButton text={item.figureRenderer.hasAction("Dance")?("Stop dancing"):("Dance")} hasDropdown={!item.figureRenderer.hasAction("Dance")} onClick={() => {
                                if(item.figureRenderer.hasAction("Dance")) {
                                    webSocketClient.sendProtobuff(SendRoomChatMessageData, SendRoomChatMessageData.create({
                                        message: ":dance 0"
                                    }));

                                    setTab(null);
                                }
                                else {
                                    setTab("dance");
                                }
                            }}/>
                        </Fragment>
                    ):(
                        <Fragment>
                            {(room?.information?.owner?.id === user?.id) && (
                                <UserContextMenuButton text={(targetUser.data.hasRights)?("Revoke rights"):("Give rights")} onClick={() => {
                                    webSocketClient.sendProtobuff(SetRoomUserRightsData, SetRoomUserRightsData.create({
                                        id: targetUser.data.id,
                                        hasRights: !targetUser.data.hasRights
                                    }));
                                }}/>
                            )}
                        </Fragment>
                    )}
                </UserContextMenuList>
            )}

            {(tab === "dance") && (
                <UserContextMenuList>
                    <UserContextMenuButton text={"Dance"} onClick={() => {
                        webSocketClient.sendProtobuff(SendRoomChatMessageData, SendRoomChatMessageData.create({
                            message: ":dance 1"
                        }));

                        setTab(null);
                    }}/>
                    
                    <UserContextMenuButton text={"Pogo Mogo"} onClick={() => {
                        webSocketClient.sendProtobuff(SendRoomChatMessageData, SendRoomChatMessageData.create({
                            message: ":dance 2"
                        }));

                        setTab(null);
                    }}/>
                    
                    <UserContextMenuButton text={"Duck Funk"} onClick={() => {
                        webSocketClient.sendProtobuff(SendRoomChatMessageData, SendRoomChatMessageData.create({
                            message: ":dance 3"
                        }));

                        setTab(null);
                    }}/>
                    
                    <UserContextMenuButton text={"The Rollie"} onClick={() => {
                        webSocketClient.sendProtobuff(SendRoomChatMessageData, SendRoomChatMessageData.create({
                            message: ":dance 4"
                        }));

                        setTab(null);
                    }}/>
                    
                    <UserContextMenuButton text={"Back"} hasBack onClick={() => {
                        setTab(null);
                    }}/>
                </UserContextMenuList>
            )}
        </RoomItemContextMenuWrapper>
    );
}
