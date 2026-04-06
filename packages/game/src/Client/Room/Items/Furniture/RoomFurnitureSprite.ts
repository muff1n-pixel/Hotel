import Furniture, { FurnitureRendererSprite } from "@Client/Furniture/Furniture";
import { MousePosition } from "@Client/Interfaces/MousePosition";
import RoomSprite from "../RoomSprite";
import RoomFurnitureItem from "./RoomFurnitureItem";
import { RoomPositionWithDirectionData } from "@pixel63/events";
import { clientInstance } from "src";

export default class RoomFurnitureSprite extends RoomSprite {
    private readonly offset: MousePosition = {
        left: 0,
        top: 0
    };

    public static getDefaultOffsetPosition(furniture: Furniture, sprite: FurnitureRendererSprite, scale: number) {
        const offset: MousePosition = {
            left: 0,
            top: 0
        };

        if(furniture.placement === "floor") {
            offset.left += 64;
            offset.top += 16;
        }
        else {
            if(furniture.direction === 2) {
                offset.left += 96;
            }
            else {
                offset.left += 32;
            }

            offset.top -= 16;
        }

        if(furniture.type !== "tile_cursor") {
            offset.left *= scale;
            offset.top *= scale;
        }

        offset.left += sprite.x;
        offset.top += sprite.y;

        return offset;
    }

    constructor(public readonly item: RoomFurnitureItem, public readonly sprite: FurnitureRendererSprite) {
        super(item);

        this.priority = this.sprite.zIndex;
        this.tag = sprite.tag;

        this.offset = RoomFurnitureSprite.getDefaultOffsetPosition(item.furnitureRenderer, sprite, 1);

        if(this.item.furnitureRenderer.type === "tile_cursor" && this.sprite.zIndex === 101) {
            this.priority = 100000;
        }
    }

    render(context: OffscreenCanvasRenderingContext2D, left: number, top: number) {
        if(this.item.furnitureRenderer.type === "tile_cursor" && this.sprite.zIndex === 101) {
            if(this.item.position) {
                const upmostFurniture = clientInstance.roomInstance.value?.getFurnitureAtUpmostPosition(this.item.position, undefined, this.item.id);

                if(upmostFurniture?.item.position && upmostFurniture.furnitureData.flags?.walkable) {
                    context.translate(0, -((upmostFurniture.item.position.depth + upmostFurniture.getDimensionDepth()) * 32));
                    context.translate(0, this.item.position.depth * 32);
                }
                else {
                    return;
                }
            }
        }

        if(this.sprite.ink) {
            context.globalCompositeOperation = this.sprite.ink;
        }

        if(this.sprite.alpha) {
            context.globalAlpha = this.sprite.alpha / 255;
        }

        context.drawImage(this.sprite.image, left + this.offset.left, top + this.offset.top);
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

        if(!this.sprite.imageData) {
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

        if(relativeStartPosition.left > this.sprite.image.width || relativeStartPosition.top > this.sprite.image.height) {
            return false;
        }

        return true;
    }
}
