import RoomFurniture from "@Client/Room/Furniture/RoomFurniture";
import RoomItemContextMenuWrapper from "@UserInterface/Components/Room/Item/ContextMenu/RoomItemContextMenuWrapper";
import UserContextMenuButton from "@UserInterface/Components/Room/Users/UserContextMenuButton";
import UserContextMenuElement from "@UserInterface/Components/Room/Users/UserContextMenuElement";
import { useDialogs } from "@UserInterface/Hooks/useDialogs";

export type RoomFurnitureFootballGateContextMenuProps = {
    roomFurniture: RoomFurniture;
}

export default function RoomFurnitureFootballGateContextMenu({ roomFurniture }: RoomFurnitureFootballGateContextMenuProps) {
    const dialogs = useDialogs();

    return (
        <RoomItemContextMenuWrapper item={roomFurniture.item}>
            <UserContextMenuElement position="top">
                {roomFurniture.furnitureData.name}
            </UserContextMenuElement>

            <UserContextMenuButton text={"Male clothes"} onClick={() => {
                dialogs.addUniqueDialog("wardrobe-football", {
                    roomFurniture,
                    gender: "male"
                });
            }}/>

            <UserContextMenuButton text={"Female clothes"} onClick={() => {
                dialogs.addUniqueDialog("wardrobe-football", {
                    roomFurniture,
                    gender: "female"
                });
            }}/>
        </RoomItemContextMenuWrapper>
    );
}
