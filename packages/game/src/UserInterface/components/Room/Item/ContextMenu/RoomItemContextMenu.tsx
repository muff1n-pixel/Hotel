import RoomFigureItem from "@Client/Room/Items/Figure/RoomFigureItem";
import { useRoomInstance } from "../../../../hooks/useRoomInstance";
import RoomPetItem from "@Client/Room/Items/Pets/RoomPetItem";
import RoomItem from "@Client/Room/Items/RoomItem";
import RoomUserContextMenu from "./Users/RoomUserContextMenu";
import RoomBotContextMenu from "./Bots/RoomBotContextMenu";
import RoomPetContextMenu from "./Pets/RoomPetContextMenu";
import RoomItemContextMenuHover from "./RoomItemContextMenuHover";

export type RoomItemContextMenuProps = {
    item: RoomItem;
};

export default function RoomItemContextMenu() {
    const room = useRoomInstance();

    if(room?.roomRenderer.focusedItem.value) {
        if(room.roomRenderer.focusedItem.value instanceof RoomFigureItem) {
            if(room.roomRenderer.focusedItem.value.type === "figure") {
                return (<RoomUserContextMenu item={room.roomRenderer.focusedItem.value}/>);
            }
            else if(room.roomRenderer.focusedItem.value.type === "bot") {
                return (<RoomBotContextMenu item={room.roomRenderer.focusedItem.value}/>);
            }
        }
        else if(room.roomRenderer.focusedItem.value instanceof RoomPetItem) {
            return (<RoomPetContextMenu item={room.roomRenderer.focusedItem.value}/>);
        }
    }

    if(room?.roomRenderer.hoveredItem.value) {
        return (<RoomItemContextMenuHover item={room?.roomRenderer.hoveredItem.value}/>);
    }

    return null;
}