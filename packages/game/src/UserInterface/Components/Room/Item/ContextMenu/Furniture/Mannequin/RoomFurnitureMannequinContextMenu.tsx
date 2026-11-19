import RoomFurniture from "@Client/Room/Furniture/RoomFurniture";
import RoomItemContextMenuWrapper from "@UserInterface/Components/Room/Item/ContextMenu/RoomItemContextMenuWrapper";
import UserContextMenuButton from "@UserInterface/Components/Room/Users/UserContextMenuButton";
import UserContextMenuElement from "@UserInterface/Components/Room/Users/UserContextMenuElement";
import { useDialogs } from "@UserInterface/Hooks/useDialogs";
import { useTranslation } from "react-i18next";

export type RoomFurnitureMannequinContextMenuProps = {
    roomFurniture: RoomFurniture;
}

export default function RoomFurnitureMannequinContextMenu({ roomFurniture }: RoomFurnitureMannequinContextMenuProps) {
    const dialogs = useDialogs();
    const [getTranslation] = useTranslation("room");

    return (
        <RoomItemContextMenuWrapper item={roomFurniture.item}>
            <UserContextMenuElement position="top">
                {roomFurniture.furnitureData.name}
            </UserContextMenuElement>

            <UserContextMenuButton text={getTranslation("item.context_menu.wardrobe")} onClick={() => {
                dialogs.addUniqueDialog("wardrobe-mannequin", {
                    roomFurniture
                });
            }}/>
        </RoomItemContextMenuWrapper>
    );
}
