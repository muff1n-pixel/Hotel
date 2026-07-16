import { FurnitureRendererSprite } from "@Client/Furniture/Furniture";
import { MousePosition } from "@Client/Interfaces/MousePosition";
import RoomSprite from "../RoomSprite";
import RoomFurnitureItem from "./RoomFurnitureItem";
import { RoomPositionWithDirectionData } from "@pixel63/events";
import RoomFurnitureOffsets from "@Client/Room/Items/Furniture/RoomFurnitureOffsets";

export default class RoomFurnitureSprite extends RoomSprite {
    public readonly defaultOffset: MousePosition = {
        left: 0,
        top: 0
    };

    constructor(public readonly item: RoomFurnitureItem, public readonly furnitureSprite: FurnitureRendererSprite) {
        super(
            item,
            RoomFurnitureOffsets.getDefaultOffsetPosition(item.furnitureRenderer, furnitureSprite, 1),
            furnitureSprite.zIndex,
            (furnitureSprite.alpha)?(furnitureSprite.alpha / 255):(undefined),
            furnitureSprite.ink,
            furnitureSprite.image,
        );

        this.priority = this.furnitureSprite.zIndex;
        this.tag = furnitureSprite.tag;

        if(this.item.furnitureRenderer.type === "tile_cursor" && this.furnitureSprite.zIndex === 101) {
            this.priority = 100000;
            this.sprite.eventMode = "none";
        }
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

    isPositionInsideBounds(startPosition: MousePosition, endPosition: MousePosition) {
        if(this.item.disabled) {
            return false;
        }
        
        if(!this.item.position) {
            return false;
        }

        if(!this.furnitureSprite.imageData) {
            return false;
        }
        
        const relativeStartPosition: MousePosition = {
            left: startPosition.left - (this.offset.left),
            top: startPosition.top - (this.offset.top)
        };
        
        const relativeEndPosition: MousePosition = {
            left: endPosition.left - (this.offset.left),
            top: endPosition.top - (this.offset.top)
        };

        if(relativeEndPosition.left < 0 || relativeEndPosition.top < 0) {
            return false;
        }

        if(relativeStartPosition.left > this.furnitureSprite.image.width || relativeStartPosition.top > this.furnitureSprite.image.height) {
            return false;
        }

        return true;
    }
}
