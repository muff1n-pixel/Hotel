import RoomFigureItem from "@Client/Room/Items/Figure/RoomFigureItem";
import RoomItemContextMenuWrapper from "../RoomItemContextMenuWrapper";
import UserContextMenuElement from "../../../Users/UserContextMenuElement";
import { Fragment, useEffect, useState } from "react";
import { useRoomInstance } from "../../../../../Hooks/useRoomInstance";
import UserContextMenuList from "../../../Users/UserContextMenuList";
import { useUser } from "../../../../../Hooks/useUser";
import UserContextMenuButton from "../../../Users/UserContextMenuButton";
import { useDialogs } from "../../../../../Hooks/useDialogs";
import { webSocketClient } from "../../../../../..";
import { RequestRoomUserTradingData, SendRoomChatMessageData, SendUserFriendRequestData, SetRoomUserRightsData, UpdateUserFriendRelationshipData, UpdateUserFriendRequestData } from "@pixel63/events";
import useFriends from "@UserInterface/Hooks/useFriends";
import { useTranslation } from "react-i18next";
import FlexLayout from "@UserInterface/Common/Layouts/FlexLayout";

export type RoomUserContextMenuProps = {
    item: RoomFigureItem;
};

export default function RoomUserContextMenu({ item }: RoomUserContextMenuProps) {
    const [getTranslation] = useTranslation("room");

    const dialogs = useDialogs();
    const room = useRoomInstance();
    const user = useUser();
    const { friends, incomingRequests, outgoingRequests } = useFriends();

    const [targetUser, setTargetUser] = useState(room?.users.find((user) => user.item.id === item.id));
    const [tab, setTab] = useState<null | "dance" | "relationship">(null);

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

            {(tab === null) && (
                <UserContextMenuList>
                    {(targetUser.data.id === user.id)?(
                        <Fragment>
                            <UserContextMenuButton text={getTranslation("item.context_menu.wardrobe")} onClick={() => {
                                dialogs.addUniqueDialog("wardrobe");
                            }}/>
                            
                            <UserContextMenuButton text={item.figureRenderer.hasAction("Dance")?(getTranslation("item.context_menu.stop_dancing")):(getTranslation("item.context_menu.dance"))} hasDropdown={!item.figureRenderer.hasAction("Dance")} onClick={() => {
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

                            <UserContextMenuButton text={getTranslation("item.context_menu.ask_to_trade")} style={{ fontSize: 11 }} onClick={() => {
                                webSocketClient.sendProtobuff(RequestRoomUserTradingData, RequestRoomUserTradingData.create({
                                    targetUserId: targetUser.data.id
                                }));

                                if(room) {
                                    room.roomRenderer.focusedItem.value = null;
                                }
                            }}/>

                            {(room?.information?.owner?.id === user?.id) && (
                                <UserContextMenuButton text={(targetUser.data.hasRights)?(getTranslation("item.context_menu.revoke_rights")):(getTranslation("item.context_menu.give_rights"))} onClick={() => {
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
                    <UserContextMenuButton text={getTranslation("item.context_menu.dances.dance_default")} onClick={() => {
                        webSocketClient.sendProtobuff(SendRoomChatMessageData, SendRoomChatMessageData.create({
                            message: ":dance 1"
                        }));

                        setTab(null);
                    }}/>
                    
                    <UserContextMenuButton text={getTranslation("item.context_menu.dances.dance_pogo_mogo")} onClick={() => {
                        webSocketClient.sendProtobuff(SendRoomChatMessageData, SendRoomChatMessageData.create({
                            message: ":dance 2"
                        }));

                        setTab(null);
                    }}/>
                    
                    <UserContextMenuButton text={getTranslation("item.context_menu.dances.dance_duck_funk")} onClick={() => {
                        webSocketClient.sendProtobuff(SendRoomChatMessageData, SendRoomChatMessageData.create({
                            message: ":dance 3"
                        }));

                        setTab(null);
                    }}/>
                    
                    <UserContextMenuButton text={getTranslation("item.context_menu.dances.dance_the_rollie")} onClick={() => {
                        webSocketClient.sendProtobuff(SendRoomChatMessageData, SendRoomChatMessageData.create({
                            message: ":dance 4"
                        }));

                        setTab(null);
                    }}/>
                    
                    <UserContextMenuButton text={getTranslation("item.context_menu.back")} hasBack onClick={() => {
                        setTab(null);
                    }}/>
                </UserContextMenuList>
            )}

            {(tab === "relationship") && (
                <UserContextMenuList>
                    <FlexLayout direction="row" gap={0}>
                        <UserContextMenuButton style={{ flex: 1 }} text={(<div className="sprite_users_relationships_heart"/>)} onClick={() => {
                            webSocketClient.sendProtobuff(UpdateUserFriendRelationshipData, UpdateUserFriendRelationshipData.create({
                                userId: targetUser.data.id,
                                relationship: "love"
                            }));

                            setTab(null);
                        }}/>
                        
                        <UserContextMenuButton style={{ flex: 1 }} text={(<div className="sprite_users_relationships_smile"/>)} onClick={() => {
                            webSocketClient.sendProtobuff(UpdateUserFriendRelationshipData, UpdateUserFriendRelationshipData.create({
                                userId: targetUser.data.id,
                                relationship: "smile"
                            }));

                            setTab(null);
                        }}/>
                        
                        <UserContextMenuButton style={{ flex: 1 }} text={(<div className="sprite_users_relationships_bobba"/>)} onClick={() => {
                            webSocketClient.sendProtobuff(UpdateUserFriendRelationshipData, UpdateUserFriendRelationshipData.create({
                                userId: targetUser.data.id,
                                relationship: "bobba"
                            }));

                            setTab(null);
                        }}/>
                    </FlexLayout>
                    
                    <UserContextMenuButton text={getTranslation("item.context_menu.friends.clear_relationship")} style={{ fontSize: 10 }} onClick={() => {
                        webSocketClient.sendProtobuff(UpdateUserFriendRelationshipData, UpdateUserFriendRelationshipData.create({
                            userId: targetUser.data.id,
                            relationship: undefined
                        }));

                        setTab(null);
                    }}/>
                    
                    <UserContextMenuButton text={getTranslation("item.context_menu.back")} hasBack onClick={() => {
                        setTab(null);
                    }}/>
                </UserContextMenuList>
            )}
        </RoomItemContextMenuWrapper>
    );
}
