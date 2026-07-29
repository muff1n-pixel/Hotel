import { FurnitureRendererSprite } from "@Client/Furniture/Furniture";
import { MousePosition } from "@Client/Interfaces/MousePosition";
import RoomSprite from "../RoomSprite";
import RoomFurnitureItem from "./RoomFurnitureItem";
import RoomFurnitureOffsets from "@Client/Room/Items/Furniture/RoomFurnitureOffsets";
import { RoomPositionWithDirectionData } from "@pixel63/events";
import RoomPriority from "../RoomPriority";

export default class RoomFurnitureMaskSprite extends RoomSprite {
    public readonly defaultOffset: MousePosition = {
        left: 0,
        top: 0
    };

    private readonly mask: RoomSprite;

    constructor(public readonly item: RoomFurnitureItem, public readonly furnitureSprite: FurnitureRendererSprite) {
        super(
            item,
            {
                left: -(item.roomRenderer.structure.rows * 32) - item.roomRenderer.structure.data.wall!.thickness,
                top: -((item.roomRenderer.structure.depth + 3.5) * 32) - item.roomRenderer.structure.data.wall!.thickness
            },
            RoomPriority.WALL_MASK_SPRITE_PRIORITY,
            undefined,
            undefined,
            item.roomRenderer.landscape.image,
            false
        );

        this.mask = new RoomSprite(
            item,
            RoomFurnitureOffsets.getDefaultOffsetPosition(item.furnitureRenderer, furnitureSprite, 1),
            RoomPriority.WALL_MASK_SPRITE_PRIORITY,
            undefined,
            furnitureSprite.ink,
            furnitureSprite.image,
        );

        this.setMask(this.mask);
    }

    public updateLandscape() {
        if(this.item.roomRenderer.landscape.image) {
            this.setTexture(this.item.roomRenderer.landscape.image);
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
            left: position.left - (this.mask.offset.left),
            top: position.top - (this.mask.offset.top)
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

    update(): void {
        super.update();

        this.mask.update();
    }

    destroy(): void {
        super.destroy();

        this.mask.destroy();
    }
}
