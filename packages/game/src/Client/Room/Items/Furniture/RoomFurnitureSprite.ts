import { FurnitureRendererSprite } from "@Client/Furniture/Furniture";
import { MousePosition } from "@Client/Interfaces/MousePosition";
import RoomSprite from "../RoomSprite";
import RoomFurnitureItem from "./RoomFurnitureItem";

export default class RoomFurnitureSprite extends RoomSprite {
    private readonly offset: MousePosition = {
        left: 0,
        top: 0
    };

    constructor(public readonly item: RoomFurnitureItem, public readonly sprite: FurnitureRendererSprite) {
        super(item);

        this.priority = this.sprite.zIndex;
        this.tag = sprite.tag;

        if(item.furnitureRenderer.placement === "floor") {
            this.offset.left += 64;
            this.offset.top += 16;
        }
        else {
            if(item.furnitureRenderer.direction === 2) {
                this.offset.left += 96;
            }
            else {
                this.offset.left += 32;
            }

            this.offset.top -= 16;
        }

        if(this.item.furnitureRenderer.type !== "tile_cursor") {
            this.offset.left *= this.item.roomRenderer.getSizeScale();
            this.offset.top *= this.item.roomRenderer.getSizeScale();
        }

        this.offset.left += this.sprite.x;
        this.offset.top += this.sprite.y;
    }

    render(context: OffscreenCanvasRenderingContext2D) {
        if(this.sprite.ink) {
            context.globalCompositeOperation = this.sprite.ink;
        }

        if(this.sprite.alpha) {
            context.globalAlpha = this.sprite.alpha / 255;
        }

        if(this.item.furnitureRenderer.type === "tile_cursor") {
            const scale = this.item.roomRenderer.getSizeScale();

            context.scale(scale, scale);
            context.drawImage(this.sprite.image, this.offset.left, this.offset.top);

            return;
        }

        context.drawImage(this.sprite.image, this.offset.left, this.offset.top);
    }

    mouseover(position: MousePosition) {
        if(this.item.disabled) {
            return null;
        }
        
        if(!this.item.position) {
            return null;
        }

        if(this.sprite.ignoreMouse) {
            return null;
        }

        if(!this.sprite.imageData) {
            return null;
        }
        
        const relativePosition: MousePosition = {
            left: position.left - (this.offset.left),
            top: position.top - (this.offset.top)
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
            row: this.item.position.row,
            column: this.item.position.column,
            depth: this.item.position.depth
        };
    }
}
