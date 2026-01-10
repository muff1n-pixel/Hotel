import RoomItem from "@/Room/Items/RoomItem";
import RoomSprite from "@/Room/Items/RoomSprite";

export type RoomPointerPosition = {
    item: RoomItem;
    sprite: RoomSprite;

    position: {
        row: number;
        column: number;
        depth: number;
    };
}

