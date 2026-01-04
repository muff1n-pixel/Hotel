import { FurnitureRendererSprite } from "@/Furniture/FurnitureRenderer.js";
import ContextNotAvailableError from "../../../Exceptions/ContextNotAvailableError.js";
import { MousePosition } from "@/Interfaces/MousePosition";
import RoomItemInterface from "@/Room/Interfaces/RoomItemInterface.js";
import RoomItemSpriteInterface from "@/Room/Interfaces/RoomItemSpriteInterface";
import FloorRenderer from "@/Room/Structure/FloorRenderer";
import RoomSprite from "../RoomSprite.js";

export default class RoomFurnitureSprite extends RoomSprite {
    constructor(public readonly item: RoomItemInterface, private readonly sprite: FurnitureRendererSprite) {
        super(item);

        this.priority = this.sprite.zIndex;
    }

    render(context: OffscreenCanvasRenderingContext2D) {
        context.drawImage(this.sprite.image, this.sprite.x + 64, this.sprite.y + 16);
    }

    mouseover(position: MousePosition) {
        return null;
    }
}
