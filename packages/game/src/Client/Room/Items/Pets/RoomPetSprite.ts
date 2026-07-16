import { FurnitureRendererSprite } from "@Client/Furniture/Furniture";
import { MousePosition } from "@Client/Interfaces/MousePosition";
import RoomSprite from "../RoomSprite";
import { RoomPositionWithDirectionData } from "@pixel63/events";
import RoomPetItem from "@Client/Room/Items/Pets/RoomPetItem";

export default class RoomPetSprite extends RoomSprite {
    private readonly offset: MousePosition = {
        left: 0,
        top: 0
    };

    constructor(public readonly item: RoomPetItem, public readonly furnitureSprite: FurnitureRendererSprite) {
        super(item);

        this.priority = this.furnitureSprite.zIndex;
        this.tag = furnitureSprite.tag;

        this.offset.left += 64;
        this.offset.top += 16;

        this.offset.left += this.furnitureSprite.x;
        this.offset.top += this.furnitureSprite.y;
    }

    render(context: OffscreenCanvasRenderingContext2D, left: number, top: number) {
        if(this.furnitureSprite.ink) {
            context.globalCompositeOperation = this.furnitureSprite.ink;
        }

        if(this.furnitureSprite.alpha) {
            context.globalAlpha = this.furnitureSprite.alpha / 255;
        }

        context.drawImage(this.furnitureSprite.image, left + this.offset.left, top + this.offset.top);
    }

    mouseover(position: MousePosition) {
        if(this.item.disabled) {
            return null;
        }
        
        if(!this.item.position) {
            return null;
        }

        if(this.furnitureSprite.ignoreMouse) {
            return null;
        }

        if(!this.furnitureSprite.imageData) {
            return null;
        }
        
        const relativePosition: MousePosition = {
            left: position.left - (this.offset.left),
            top: position.top - (this.offset.top)
        };

        if(relativePosition.left < 0 || relativePosition.top < 0) {
            return null;
        }

        if(relativePosition.left > this.furnitureSprite.image.width || relativePosition.top > this.furnitureSprite.image.height) {
            return null;
        }

        const pixel = ((relativePosition.left + relativePosition.top * this.furnitureSprite.imageData.width) * 4) + 3;

        if(this.furnitureSprite.imageData.data[pixel] < 50) {
            return null;
        }

        return RoomPositionWithDirectionData.create({
            row: this.item.position.row,
            column: this.item.position.column,
            depth: this.item.position.depth
        });
    }
}
