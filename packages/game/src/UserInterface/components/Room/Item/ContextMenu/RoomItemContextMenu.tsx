import RoomFigureItem from "@Client/Room/Items/Figure/RoomFigureItem";
import { useRoomInstance } from "../../../../Hooks/useRoomInstance";
import RoomPetItem from "@Client/Room/Items/Pets/RoomPetItem";
import RoomItem from "@Client/Room/Items/RoomItem";
import RoomUserContextMenu from "./Users/RoomUserContextMenu";
import RoomBotContextMenu from "./Bots/RoomBotContextMenu";
import RoomPetContextMenu from "./Pets/RoomPetContextMenu";
import RoomItemContextMenuHover from "./RoomItemContextMenuHover";
import { useEffect, useState } from "react";
import RoomFurnitureItem from "@Client/Room/Items/Furniture/RoomFurnitureItem";

export type RoomItemContextMenuProps = {
    item: RoomItem;
};

export default function RoomItemContextMenu() {
    const room = useRoomInstance();

    const [focusedItem, setFocusedItem] = useState<RoomItem | null>();
    const [hoveredItem, setHoveredItem] = useState<RoomItem | null>();

    useEffect(() => {
        if(!room) {
            return;
        }

        const unsubscribeFocusedItem = room.roomRenderer.focusedItem.subscribe(setFocusedItem);
        const unsubscribeHoveredItem = room.roomRenderer.hoveredItem.subscribe(setHoveredItem);

        return () => {
            unsubscribeFocusedItem();
            unsubscribeHoveredItem();

            setFocusedItem(null);
            setHoveredItem(null);
        };
    }, [room]);

    if(focusedItem) {
        if(focusedItem instanceof RoomFigureItem) {
            if(focusedItem.type === "figure") {
                return (<RoomUserContextMenu item={focusedItem}/>);
            }
            else if(focusedItem.type === "bot") {
                return (<RoomBotContextMenu item={focusedItem}/>);
            }
        }
        else if(focusedItem instanceof RoomPetItem) {
            return (<RoomPetContextMenu item={focusedItem}/>);
        }
        else if(focusedItem instanceof RoomFurnitureItem) {
            const roomFurniture = focusedItem.roomRenderer.roomInstance?.getFurnitureByItem(focusedItem);

            if(roomFurniture?.getLogic()?.isContextMenuAvailable?.()) {
                return roomFurniture.getLogic()?.getContextMenu?.();
            }
        }
    }

    if(hoveredItem) {
        return (<RoomItemContextMenuHover item={hoveredItem}/>);
    }

    return null;
}