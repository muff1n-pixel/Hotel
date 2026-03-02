import RoomItem from "@Client/Room/Items/RoomItem";
import RoomSprite from "@Client/Room/Items/RoomSprite";
import { RoomPositionWithDirectionData } from "@pixel63/events";

export type RoomPointerPosition = {
    item: RoomItem;
    sprite?: RoomSprite;

    position?: RoomPositionWithDirectionData;

    direction?: number;
}

