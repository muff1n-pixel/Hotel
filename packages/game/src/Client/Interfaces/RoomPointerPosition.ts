import RoomItem from "@Client/Room/Items/RoomItem";
import RoomSprite from "@Client/Room/Items/RoomSprite";
import { RoomPositionData } from "@pixel63/events";

export type RoomPointerPosition = {
    item: RoomItem;
    sprite?: RoomSprite;

    position?: RoomPositionData;

    direction?: number;
}

