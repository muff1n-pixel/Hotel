import RoomItem from "@Client/Room/Items/RoomItem";
import RoomSprite from "@Client/Room/Items/RoomSprite";

export type RoomPointerPosition = {
    item: RoomItem;
    sprite: RoomSprite;

    position: {
        row: number;
        column: number;
        depth: number;
    };
}

