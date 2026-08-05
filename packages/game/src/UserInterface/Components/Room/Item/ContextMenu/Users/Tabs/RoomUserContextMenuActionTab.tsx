import { webSocketClient } from "@Game/index";
import { SendRoomChatMessageData } from "@pixel63/events";
import UserContextMenuButton from "@UserInterface/Components/Room/Users/UserContextMenuButton";
import UserContextMenuList from "@UserInterface/Components/Room/Users/UserContextMenuList";
import { useTranslation } from "react-i18next";
import { RoomUserContextMenuTabProps } from "./RoomUserContextMenuTab";
import { useRoomInstance } from "@UserInterface/Hooks/useRoomInstance";

export default function RoomUserContextMenuActionTab({ targetUser, closeTab }: RoomUserContextMenuTabProps) {
    const room = useRoomInstance();
    const [getTranslation] = useTranslation("room");

    return (
        <UserContextMenuList>
            <UserContextMenuButton text={(!targetUser.data.actions.includes("Sit"))?(getTranslation("item.context_menu.actions.sit")):(getTranslation("item.context_menu.actions.stand"))} onClick={() => {
                room?.websocket.sendProtobuff(SendRoomChatMessageData, SendRoomChatMessageData.create({
                    message: (!targetUser.data.actions.includes("Sit"))?(":sit"):(":stand")
                }));

                closeTab();
            }}/>
            
            <UserContextMenuButton text={getTranslation("item.context_menu.actions.wave")} onClick={() => {
                room?.websocket.sendProtobuff(SendRoomChatMessageData, SendRoomChatMessageData.create({
                    message: ":wave"
                }));

                closeTab();
            }}/>
            
            <UserContextMenuButton text={getTranslation("item.context_menu.actions.laugh")} onClick={() => {
                room?.websocket.sendProtobuff(SendRoomChatMessageData, SendRoomChatMessageData.create({
                    message: ":laugh"
                }));

                closeTab();
            }}/>
            
            <UserContextMenuButton text={getTranslation("item.context_menu.actions.sleep")} onClick={() => {
                room?.websocket.sendProtobuff(SendRoomChatMessageData, SendRoomChatMessageData.create({
                    message: ":afk"
                }));

                closeTab();
            }}/>
            
            <UserContextMenuButton text={getTranslation("item.context_menu.back")} hasBack onClick={() => {
                closeTab();
            }}/>
        </UserContextMenuList>
    );
}