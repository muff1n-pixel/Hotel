import RoomFigureItem from "@Client/Room/Items/Figure/RoomFigureItem";
import { useRoomInstance } from "../../../../Hooks/useRoomInstance";
import RoomPetItem from "@Client/Room/Items/Pets/RoomPetItem";
import RoomItem from "@Client/Room/Items/RoomItem";
import RoomUserContextMenu from "./Users/RoomUserContextMenu";
import RoomBotContextMenu from "./Bots/RoomBotContextMenu";
import RoomPetContextMenu from "./Pets/RoomPetContextMenu";
import RoomItemContextMenuHover from "./RoomItemContextMenuHover";
import { useEffect, useMemo, useState } from "react";
import RoomFurnitureItem from "@Client/Room/Items/Furniture/RoomFurnitureItem";

export type RoomItemContextMenuProps = {
    item: RoomItem;
};

export default function RoomItemContextMenu() {
    const room = useRoomInstance();

    const [focusedItem, setFocusedItem] = useState<RoomItem | null>();
    const [hoveredItem, setHoveredItem] = useState<RoomItem | null>();

    const [_state, setState] = useState<number>();

    const focusedFurniture = useMemo(() => {
        if(!room) {
            return null;
        }

        if(!focusedItem) {
            return null;
        }

        if(focusedItem instanceof RoomFurnitureItem) {
            const roomFurniture = room.furnitures.find((furniture) => furniture.item.id === focusedItem.id);

            if(!roomFurniture) {
                return null;
            }

            return roomFurniture;
        }
    }, [focusedItem, room]);

    useEffect(() => {
        if(!room) {
            return;
        }

        const unsubscribeFocusedItem = room.roomRenderer.focusedItem.subscribe((value) => {
            setFocusedItem(value);
            setState(room.roomRenderer.focusedItem.state);
        });

        const unsubscribeHoveredItem = room.roomRenderer.hoveredItem.subscribe((value) => {
            setHoveredItem(value);
            setState(room.roomRenderer.focusedItem.state);
        });

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
        else if(focusedFurniture) {
            if(focusedFurniture?.getLogic()?.isContextMenuAvailable?.()) {
                return focusedFurniture.getLogic()?.getContextMenu?.();
            }
        }
    }

    if(hoveredItem) {
        return (<RoomItemContextMenuHover item={hoveredItem}/>);
    }

    return null;
}