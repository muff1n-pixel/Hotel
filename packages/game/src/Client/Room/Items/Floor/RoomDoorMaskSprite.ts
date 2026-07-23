import RoomSprite from "../RoomSprite";
import RoomMapItem from "../Map/RoomWallItem";

export default class RoomDoorMaskSprite extends RoomSprite {
    constructor(public readonly item: RoomMapItem, private readonly image: OffscreenCanvas) {
        super(
            item,
            {
                left: -(item.wallRenderer!.structure.rows * 32) - item.wallRenderer!.structure.data.wall!.thickness,
                top: -((item.wallRenderer!.structure.depth + 3.5) * 32) - item.wallRenderer!.structure.data.wall!.thickness
            },
            -100,
            undefined,
            undefined,
            image
        );
    }

    mouseover() {
        return null;
    }
}