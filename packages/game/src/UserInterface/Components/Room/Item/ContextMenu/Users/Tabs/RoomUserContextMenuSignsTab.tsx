import { webSocketClient } from "@Game/index";
import { SendRoomChatMessageData } from "@pixel63/events";
import UserContextMenuButton from "@UserInterface/Components/Room/Users/UserContextMenuButton";
import UserContextMenuList from "@UserInterface/Components/Room/Users/UserContextMenuList";
import { useTranslation } from "react-i18next";
import { RoomUserContextMenuTabProps } from "./RoomUserContextMenuTab";
import FlexLayout from "@UserInterface/Common/Layouts/FlexLayout";
import { useRoomInstance } from "@UserInterface/Hooks/useRoomInstance";

export default function RoomUserContextMenuSignsTab({ closeTab }: RoomUserContextMenuTabProps) {
    const room = useRoomInstance();
    const [getTranslation] = useTranslation("room");

    return (
        <UserContextMenuList>
            {Array(3).fill(null).map((_, row) => (
                <FlexLayout direction="row" gap={0} style={{ flexWrap: "wrap" }}>
                    {Array(3).fill(null).map((_, index) => (
                        <UserContextMenuButton key={index} style={{ flex: 1 }} text={1 + (row * 3) + index} onClick={() => {
                            room?.websocket.sendProtobuff(SendRoomChatMessageData, SendRoomChatMessageData.create({
                                message: `:sign ${1 + (row * 3) + index}`
                            }));

                            closeTab();
                        }}/>
                    ))}
                </FlexLayout>
            ))}

            <FlexLayout direction="row" gap={0} style={{ flexWrap: "wrap" }}>
                <UserContextMenuButton style={{ flex: 1 }} text={10} onClick={() => {
                    room?.websocket.sendProtobuff(SendRoomChatMessageData, SendRoomChatMessageData.create({
                        message: `:sign 10`
                    }));

                    closeTab();
                }}/>
                
                <UserContextMenuButton style={{ flex: 1 }} text={0} onClick={() => {
                    room?.websocket.sendProtobuff(SendRoomChatMessageData, SendRoomChatMessageData.create({
                        message: `:sign 0`
                    }));

                    closeTab();
                }}/>

                <UserContextMenuButton style={{ flex: 1 }} text={(<div className="sprite_room_user_signs_11"/>)} onClick={() => {
                    room?.websocket.sendProtobuff(SendRoomChatMessageData, SendRoomChatMessageData.create({
                        message: ":sign 11"
                    }));

                    closeTab();
                }}/>
            </FlexLayout>

            <FlexLayout direction="row" gap={0} style={{ flexWrap: "wrap" }}>
                <UserContextMenuButton style={{ flex: 1 }} text={(<div className="sprite_room_user_signs_12"/>)} onClick={() => {
                    room?.websocket.sendProtobuff(SendRoomChatMessageData, SendRoomChatMessageData.create({
                        message: ":sign 12"
                    }));

                    closeTab();
                }}/>

                <UserContextMenuButton style={{ flex: 1 }} text={(<div className="sprite_room_user_signs_13"/>)} onClick={() => {
                    room?.websocket.sendProtobuff(SendRoomChatMessageData, SendRoomChatMessageData.create({
                        message: ":sign 13"
                    }));

                    closeTab();
                }}/>

                <UserContextMenuButton style={{ flex: 1 }} text={(<div className="sprite_room_user_signs_14"/>)} onClick={() => {
                    room?.websocket.sendProtobuff(SendRoomChatMessageData, SendRoomChatMessageData.create({
                        message: ":sign 14"
                    }));

                    closeTab();
                }}/>
            </FlexLayout>
                
            <FlexLayout direction="row" gap={0} style={{ flexWrap: "wrap" }}>
                <UserContextMenuButton style={{ flex: 1 }} text={(<div className="sprite_room_user_signs_15"/>)} onClick={() => {
                    room?.websocket.sendProtobuff(SendRoomChatMessageData, SendRoomChatMessageData.create({
                        message: ":sign 15"
                    }));

                    closeTab();
                }}/>

                <UserContextMenuButton style={{ flex: 1 }} text={(<div className="sprite_room_user_signs_16"/>)} onClick={() => {
                    room?.websocket.sendProtobuff(SendRoomChatMessageData, SendRoomChatMessageData.create({
                        message: ":sign 16"
                    }));

                    closeTab();
                }}/>
                
                <UserContextMenuButton style={{ flex: 1 }} text={(<div className="sprite_room_user_signs_17"/>)} onClick={() => {
                    room?.websocket.sendProtobuff(SendRoomChatMessageData, SendRoomChatMessageData.create({
                        message: ":sign 17"
                    }));

                    closeTab();
                }}/>
            </FlexLayout>
            
            <UserContextMenuButton text={getTranslation("item.context_menu.back")} hasBack onClick={() => {
                closeTab();
            }}/>
        </UserContextMenuList>
    );
}