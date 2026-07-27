import { FurnitureRendererSprite } from "@Client/Furniture/Furniture";
import { MousePosition } from "@Client/Interfaces/MousePosition";
import RoomSprite from "../RoomSprite";
import RoomFurnitureItem from "./RoomFurnitureItem";
import RoomFurnitureOffsets from "@Client/Room/Items/Furniture/RoomFurnitureOffsets";
import { Texture } from "pixi.js";
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
            undefined,
            RoomPriority.WALL_MASK_SPRITE_PRIORITY,
            undefined,
            undefined,
            item.roomRenderer.landscape.image,
        );

        this.sprite.x = -(item.roomRenderer.structure.rows * 32) - item.roomRenderer.structure.data.wall!.thickness;
        this.sprite.y = -((item.roomRenderer.structure.depth + 3.5) * 32) - item.roomRenderer.structure.data.wall!.thickness;

        this.mask = new RoomSprite(
            item,
            RoomFurnitureOffsets.getDefaultOffsetPosition(item.furnitureRenderer, furnitureSprite, 1),
            RoomPriority.WALL_MASK_SPRITE_PRIORITY,
            undefined,
            furnitureSprite.ink,
            furnitureSprite.image,
        );

        this.sprite.setMask({
            mask: this.mask.sprite,
            inverse: false,
            channel: "alpha"
        });
    }

    public updateLandscape() {
        if(this.item.roomRenderer.landscape.image) {
            this.sprite.texture = Texture.from(this.item.roomRenderer.landscape.image);
            this.sprite.texture.source.scaleMode = "nearest";
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
        this.mask.update();

        this.sprite.zIndex = this.item.calculatedPriority + this.priority;

        this.sprite.blendMode = this.blendMode;
        this.sprite.alpha = this.alpha ?? this.item.alpha;

        this.sprite.visible = !this.item.disabled || !this.disabled;
    }

    destroy(): void {
        super.destroy();

        this.mask.destroy();
    }
}
