import RoomFurniture from "@Client/Room/Furniture/RoomFurniture";
import { UseRoomFurnitureData } from "@pixel63/events";
import RoomItemContextMenuWrapper from "@UserInterface/Components/Room/Item/ContextMenu/RoomItemContextMenuWrapper";
import UserContextMenuButton from "@UserInterface/Components/Room/Users/UserContextMenuButton";
import UserContextMenuElement from "@UserInterface/Components/Room/Users/UserContextMenuElement";
import { useDialogs } from "@UserInterface/Hooks/useDialogs";
import { webSocketClient } from "@Game/index";
import { useRoomInstance } from "@UserInterface/Hooks/useRoomInstance";
import { useTranslation } from "react-i18next";

export type RoomFurnitureTraxContextMenuProps = {
    roomFurniture: RoomFurniture;
}

export default function RoomFurnitureTraxContextMenu({ roomFurniture }: RoomFurnitureTraxContextMenuProps) {
    const dialogs = useDialogs();
    const room = useRoomInstance();
    const [getTranslation] = useTranslation("room");

    return (
        <RoomItemContextMenuWrapper item={roomFurniture.item}>
            <UserContextMenuElement position="top">
                Trax
            </UserContextMenuElement>

            <UserContextMenuButton text={(roomFurniture.data.animation === 0)?(getTranslation("item.context_menu.turn_on")):(getTranslation("item.context_menu.turn_off"))} onClick={() => {
                room?.websocket.sendProtobuff(UseRoomFurnitureData, UseRoomFurnitureData.create({
                    id: roomFurniture.data.id,
                    animation: (roomFurniture.data.animation === 0)?(1):(0)
                }));
            }}/>

            <UserContextMenuButton text={getTranslation("item.context_menu.playlists")} onClick={() => {
                dialogs.openUniqueDialog("trax-playlists", {
                    roomFurniture
                });
            }}/>
        </RoomItemContextMenuWrapper>
    );
}
