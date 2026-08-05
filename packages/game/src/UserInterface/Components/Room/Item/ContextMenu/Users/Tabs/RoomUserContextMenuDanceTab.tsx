import { webSocketClient } from "@Game/index";
import { SendRoomChatMessageData } from "@pixel63/events";
import UserContextMenuButton from "@UserInterface/Components/Room/Users/UserContextMenuButton";
import UserContextMenuList from "@UserInterface/Components/Room/Users/UserContextMenuList";
import { useTranslation } from "react-i18next";
import { RoomUserContextMenuTabProps } from "./RoomUserContextMenuTab";
import { useRoomInstance } from "@UserInterface/Hooks/useRoomInstance";

export default function RoomUserContextMenuDanceTab({ closeTab }: RoomUserContextMenuTabProps) {
    const room = useRoomInstance();
    const [getTranslation] = useTranslation("room");

    return (
        <UserContextMenuList>
            <UserContextMenuButton text={getTranslation("item.context_menu.dances.dance_default")} onClick={() => {
                room?.websocket.sendProtobuff(SendRoomChatMessageData, SendRoomChatMessageData.create({
                    message: ":dance 1"
                }));

                closeTab();
            }}/>
            
            <UserContextMenuButton text={getTranslation("item.context_menu.dances.dance_pogo_mogo")} onClick={() => {
                room?.websocket.sendProtobuff(SendRoomChatMessageData, SendRoomChatMessageData.create({
                    message: ":dance 2"
                }));

                closeTab();
            }}/>
            
            <UserContextMenuButton text={getTranslation("item.context_menu.dances.dance_duck_funk")} onClick={() => {
                room?.websocket.sendProtobuff(SendRoomChatMessageData, SendRoomChatMessageData.create({
                    message: ":dance 3"
                }));

                closeTab();
            }}/>
            
            <UserContextMenuButton text={getTranslation("item.context_menu.dances.dance_the_rollie")} onClick={() => {
                room?.websocket.sendProtobuff(SendRoomChatMessageData, SendRoomChatMessageData.create({
                    message: ":dance 4"
                }));

                closeTab();
            }}/>
            
            <UserContextMenuButton text={getTranslation("item.context_menu.back")} hasBack onClick={() => {
                closeTab();
            }}/>
        </UserContextMenuList>
    );
}