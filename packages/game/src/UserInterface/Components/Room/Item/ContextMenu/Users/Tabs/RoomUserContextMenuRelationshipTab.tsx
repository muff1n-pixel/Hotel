import { webSocketClient } from "@Game/index";
import { UpdateUserFriendRelationshipData } from "@pixel63/events";
import UserContextMenuButton from "@UserInterface/Components/Room/Users/UserContextMenuButton";
import UserContextMenuList from "@UserInterface/Components/Room/Users/UserContextMenuList";
import { useTranslation } from "react-i18next";
import { RoomUserContextMenuTabProps } from "./RoomUserContextMenuTab";
import FlexLayout from "@UserInterface/Common/Layouts/FlexLayout";

export default function RoomUserContextMenuRelationshipTab({ targetUser, setTab }: RoomUserContextMenuTabProps) {
    const [getTranslation] = useTranslation("room");

    return (
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
    );
}