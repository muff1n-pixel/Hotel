import { MousePosition } from "@/Interfaces/MousePosition";
import RoomSprite from "../RoomSprite.js";
import RoomMapItem from "../Map/RoomFurnitureItem.js";

export default class RoomWallSprite extends RoomSprite {
    priority = -2000;

    private readonly offset: MousePosition;

    constructor(public readonly item: RoomMapItem, private readonly image: OffscreenCanvas) {
        super(item);

        this.offset = {
            left: -(this.item.wallRenderer.rows * 32),
            top: -((this.item.wallRenderer.depth + 3.5) * 32)  
        }
    }

    render(context: OffscreenCanvasRenderingContext2D) {
        context.drawImage(this.image, this.offset.left - this.item.wallRenderer.structure.wall.thickness, this.offset.top);
    }

    mouseover(position: MousePosition) {
        return null;
    }
}