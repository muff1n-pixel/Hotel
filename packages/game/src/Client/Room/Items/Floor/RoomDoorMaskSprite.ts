import { MousePosition } from "@Client/Interfaces/MousePosition";
import RoomSprite from "../RoomSprite";
import RoomMapItem from "../Map/RoomWallItem";
import { Sprite } from "pixi.js";

export default class RoomDoorMaskSprite extends RoomSprite {
    constructor(public readonly item: RoomMapItem, private readonly image: OffscreenCanvas) {
        super(
            item,
            {
                left: -(item.wallRenderer!.rows * 32) - item.wallRenderer!.structure.wall!.thickness,
                top: -((item.wallRenderer!.depth + 3.5) * 32) - item.wallRenderer!.structure.wall!.thickness
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