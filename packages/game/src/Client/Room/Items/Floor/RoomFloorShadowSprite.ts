import RoomFloorSprite from "@Client/Room/Items/Floor/RoomFloorSprite";
import RoomFloorItem from "@Client/Room/Items/Map/RoomFloorItem";
import RoomPriority from "../RoomPriority";

export default class RoomFloorShadowSprite extends RoomFloorSprite {
    constructor(item: RoomFloorItem, image: OffscreenCanvas) {
        super(item, image);

        this.priority = RoomPriority.FLOOR_SHADOW_SPRITE_PRIORITY;

        this.update();
    }

    mouseover() {
        return null;
    }
}