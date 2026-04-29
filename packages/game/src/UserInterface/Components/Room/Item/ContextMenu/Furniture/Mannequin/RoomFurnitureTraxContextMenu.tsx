import RoomFurniture from "@Client/Room/Furniture/RoomFurniture";
import { UseRoomFurnitureData } from "@pixel63/events";
import RoomItemContextMenuWrapper from "@UserInterface/Components/Room/Item/ContextMenu/RoomItemContextMenuWrapper";
import UserContextMenuButton from "@UserInterface/Components/Room/Users/UserContextMenuButton";
import UserContextMenuElement from "@UserInterface/Components/Room/Users/UserContextMenuElement";
import { useDialogs } from "@UserInterface/Hooks2/useDialogs";
import { webSocketClient } from "@Game/index";

export type RoomFurnitureTraxContextMenuProps = {
    roomFurniture: RoomFurniture;
}

export default function RoomFurnitureTraxContextMenu({ roomFurniture }: RoomFurnitureTraxContextMenuProps) {
    const dialogs = useDialogs();

    return (
        <RoomItemContextMenuWrapper item={roomFurniture.item}>
            <UserContextMenuElement position="top">
                Trax
            </UserContextMenuElement>

            <UserContextMenuButton text={(roomFurniture.data.animation === 0)?("Turn on"):("Turn off")} onClick={() => {
                webSocketClient.sendProtobuff(UseRoomFurnitureData, UseRoomFurnitureData.create({
                    id: roomFurniture.data.id,
                    animation: (roomFurniture.data.animation === 0)?(1):(0)
                }));
            }}/>

            <UserContextMenuButton text={"Playlists"} onClick={() => {
                dialogs.openUniqueDialog("trax-playlists", {
                    roomFurniture
                });
            }}/>
        </RoomItemContextMenuWrapper>
    );
}
