import { FurnitureRendererSprite } from "@Client/Furniture/Furniture";
import { MousePosition } from "@Client/Interfaces/MousePosition";
import RoomSprite from "../RoomSprite";
import { RoomPositionWithDirectionData } from "@pixel63/events";
import RoomPetItem from "@Client/Room/Items/Pets/RoomPetItem";

export default class RoomPetSprite extends RoomSprite {
    constructor(public readonly item: RoomPetItem, public readonly furnitureSprite: FurnitureRendererSprite) {
        super(
            item,
            {
                left: 64 + furnitureSprite.x,
                top: 16 + furnitureSprite.y
            },
            furnitureSprite.zIndex,
            (furnitureSprite.alpha)?(furnitureSprite.alpha / 255):(undefined),
            furnitureSprite.ink,
            furnitureSprite.image
        );

        this.tag = furnitureSprite.tag;
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
