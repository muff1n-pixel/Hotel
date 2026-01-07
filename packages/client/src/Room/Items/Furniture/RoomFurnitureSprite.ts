import { FurnitureRendererSprite } from "@/Furniture/FurnitureRenderer.js";
import { MousePosition } from "@/Interfaces/MousePosition";
import RoomSprite from "../RoomSprite.js";
import RoomFurnitureItem from "./RoomFurnitureItem.js";

export default class RoomFurnitureSprite extends RoomSprite {
    constructor(public readonly item: RoomFurnitureItem, private readonly sprite: FurnitureRendererSprite) {
        super(item);

        this.priority = this.sprite.zIndex;
    }

    render(context: OffscreenCanvasRenderingContext2D) {
        if(this.sprite.ink) {
            context.globalCompositeOperation = this.sprite.ink;
        }

        if(this.sprite.alpha) {
            context.globalAlpha = this.sprite.alpha / 255;
        }

        context.drawImage(this.sprite.image, this.sprite.x + 64, this.sprite.y + 16);
    }

    mouseover(position: MousePosition) {
        if(this.sprite.ignoreMouse) {
            return null;
        }
        
        const relativePosition: MousePosition = {
            left: position.left - (this.sprite.x + 64),
            top: position.top - (this.sprite.y + 16)
        };

        if(relativePosition.left < 0 || relativePosition.top < 0) {
            return null;
        }

        if(relativePosition.left > this.sprite.image.width || relativePosition.top > this.sprite.image.height) {
            return null;
        }

        const pixel = ((relativePosition.left + relativePosition.top * this.sprite.imageData.width) * 4) + 3;

        if(this.sprite.imageData.data[pixel] < 50) {
            return null;
        }

        return {
            row: this.item.position!.row,
            column: this.item.position!.column,
            depth: this.item.position!.depth
        };
    }
}
