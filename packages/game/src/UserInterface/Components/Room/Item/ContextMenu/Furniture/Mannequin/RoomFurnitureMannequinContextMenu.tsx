import RoomFurniture from "@Client/Room/Furniture/RoomFurniture";
import RoomItemContextMenuWrapper from "@UserInterface/Components/Room/Item/ContextMenu/RoomItemContextMenuWrapper";
import UserContextMenuButton from "@UserInterface/Components/Room/Users/UserContextMenuButton";
import UserContextMenuElement from "@UserInterface/Components/Room/Users/UserContextMenuElement";
import { useDialogs } from "@UserInterface/Hooks2/useDialogs";

export type RoomFurnitureMannequinContextMenuProps = {
    roomFurniture: RoomFurniture;
}

export default function RoomFurnitureMannequinContextMenu({ roomFurniture }: RoomFurnitureMannequinContextMenuProps) {
    const dialogs = useDialogs();

    return (
        <RoomItemContextMenuWrapper item={roomFurniture.item}>
            <UserContextMenuElement position="top">
                {roomFurniture.furnitureData.name}
            </UserContextMenuElement>

            <UserContextMenuButton text={"Wardrobe"} onClick={() => {
                dialogs.addUniqueDialog("wardrobe-mannequin", {
                    roomFurniture
                });
            }}/>
        </RoomItemContextMenuWrapper>
    );
}
