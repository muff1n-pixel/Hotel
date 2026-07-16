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

    render(context: OffscreenCanvasRenderingContext2D, left: number, top: number) {
        context.drawImage(this.image, left + this.offset.left - this.item.wallRenderer!.structure.wall!.thickness, top + this.offset.top);
    }

    mouseover() {
        return null;
    }
}