import RoomUser from "@Client/Room/Users/RoomUser";
import { webSocketClient } from "@Game/index";
import { RequestRoomUserTradingData, SendRoomChatMessageData, SendUserFriendRequestData, SetRoomUserRightsData, UpdateUserFriendRequestData } from "@pixel63/events";
import UserContextMenuButton from "@UserInterface/Components/Room/Users/UserContextMenuButton";
import UserContextMenuList from "@UserInterface/Components/Room/Users/UserContextMenuList";
import { useDialogs } from "@UserInterface/Hooks/useDialogs";
import useFriends from "@UserInterface/Hooks/useFriends";
import { useRoomInstance } from "@UserInterface/Hooks/useRoomInstance";
import { useUser } from "@UserInterface/Hooks/useUser";
import { useTranslation } from "react-i18next";
import { Fragment } from "react/jsx-runtime";

export type RoomUserContextMenuTabProps = {
    targetUser: RoomUser;

    setTab: (tab: string | null) => void;
    closeTab: () => void;
    close: () => void;
};

export default function RoomUserContextMenuTab({ targetUser, setTab, closeTab, close }: RoomUserContextMenuTabProps) {
    const [getTranslation] = useTranslation("room");
    
    const user = useUser();
    const dialogs = useDialogs();
    const room = useRoomInstance();
    const { friends, incomingRequests, outgoingRequests } = useFriends();

    return (
        <UserContextMenuList>
            {(targetUser.data.id === user.id)?(
                <Fragment>
                    <UserContextMenuButton text={getTranslation("item.context_menu.wardrobe")} onClick={() => {
                        dialogs.addUniqueDialog("wardrobe");
                    }}/>
                    
                    <UserContextMenuButton text={getTranslation("item.context_menu.actions")} hasDropdown={true} onClick={() => {
                        setTab("actions");
                    }}/>
                    
                    <UserContextMenuButton text={targetUser.data.actions.some((action) => action.startsWith("Dance"))?(getTranslation("item.context_menu.stop_dancing")):(getTranslation("item.context_menu.dance"))} hasDropdown={!targetUser.data.actions.some((action) => action.startsWith("Dance"))} onClick={() => {
                        if(targetUser.data.actions.some((action) => action.startsWith("Dance"))) {
                            room?.websocket.sendProtobuff(SendRoomChatMessageData, SendRoomChatMessageData.create({
                                message: ":dance 0"
                            }));

                            close();
                            closeTab();
                        }
                        else {
                            setTab("dance");
                        }
                    }}/>
                    
                    <UserContextMenuButton text={getTranslation("item.context_menu.signs")} hasDropdown={!targetUser.data.actions.some((action) => action.startsWith("Sign"))} onClick={() => {
                        setTab("signs");
                    }}/>
                </Fragment>
            ):(
                <Fragment>
                    {outgoingRequests?.some((request) => request.id === targetUser.data.id)?(
                        <UserContextMenuButton text={getTranslation("item.context_menu.friends.revoke_request")} style={{ fontSize: 11 }} onClick={() => {
                            webSocketClient.sendProtobuff(UpdateUserFriendRequestData, UpdateUserFriendRequestData.create({
                                userId: targetUser.data.id,
                                accept: false
                            }));
                        }}/>
                    ):(
                        (incomingRequests?.some((request) => request.id === targetUser.data.id))?(
                            <UserContextMenuButton text={getTranslation("item.context_menu.friends.accept_request")} style={{ fontSize: 11 }} onClick={() => {
                                webSocketClient.sendProtobuff(UpdateUserFriendRequestData, UpdateUserFriendRequestData.create({
                                    userId: targetUser.data.id,
                                    accept: true
                                }));
                            }}/>
                        ):(
                            (!friends?.some((friend) => friend.id === targetUser.data.id))?(
                                <UserContextMenuButton text={getTranslation("item.context_menu.friends.ask_to_be_friends")} style={{ fontSize: 10 }} onClick={() => {
                                    webSocketClient.sendProtobuff(SendUserFriendRequestData, SendUserFriendRequestData.create({
                                        userId: targetUser.data.id
                                    }));
                                }}/>
                            ):(
                                <UserContextMenuButton text={getTranslation("item.context_menu.friends.relationship")} style={{ fontSize: 11 }} onClick={() => {
                                    setTab("relationship");
                                }}/>
                            )
                        )
                    )}

                    {(room?.isTradingAllowed()) && (
                        <UserContextMenuButton text={getTranslation("item.context_menu.ask_to_trade")} style={{ fontSize: 11 }} onClick={() => {
                            room.websocket.sendProtobuff(RequestRoomUserTradingData, RequestRoomUserTradingData.create({
                                targetUserId: targetUser.data.id
                            }));

                            if(room) {
                                room.roomRenderer.focusedItem.value = null;
                            }
                        }}/>
                    )}

                    {(room?.information?.owner?.id === user?.id) && (
                        <UserContextMenuButton text={(targetUser.data.hasRights)?(getTranslation("item.context_menu.revoke_rights")):(getTranslation("item.context_menu.give_rights"))} onClick={() => {
                            room.websocket.sendProtobuff(SetRoomUserRightsData, SetRoomUserRightsData.create({
                                id: targetUser.data.id,
                                hasRights: !targetUser.data.hasRights
                            }));
                        }}/>
                    )}
                </Fragment>
            )}
        </UserContextMenuList>
    );
}