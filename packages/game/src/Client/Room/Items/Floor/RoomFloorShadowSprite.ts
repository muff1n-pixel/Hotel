import RoomFloorSprite from "@Client/Room/Items/Floor/RoomFloorSprite";
import RoomFloorItem from "@Client/Room/Items/Map/RoomFloorItem";

export default class RoomFloorShadowSprite extends RoomFloorSprite {
    constructor(item: RoomFloorItem, image: OffscreenCanvas) {
        super(item, image);

        this.priority = -5000;
    }

    mouseover() {
        return null;
    }
}