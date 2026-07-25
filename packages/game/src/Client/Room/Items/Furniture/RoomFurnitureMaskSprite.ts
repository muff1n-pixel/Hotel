import { FurnitureRendererSprite } from "@Client/Furniture/Furniture";
import { MousePosition } from "@Client/Interfaces/MousePosition";
import RoomSprite from "../RoomSprite";
import RoomFurnitureItem from "./RoomFurnitureItem";
import RoomFurnitureOffsets from "@Client/Room/Items/Furniture/RoomFurnitureOffsets";
import { Texture } from "pixi.js";

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
            -100,
            undefined,
            undefined,
            item.roomRenderer.landscape.image,
        );

        this.sprite.x = -(item.roomRenderer.structure.rows * 32) - item.roomRenderer.structure.data.wall!.thickness;
        this.sprite.y = -((item.roomRenderer.structure.depth + 3.5) * 32) - item.roomRenderer.structure.data.wall!.thickness;

        this.mask = new RoomSprite(
            item,
            RoomFurnitureOffsets.getDefaultOffsetPosition(item.furnitureRenderer, furnitureSprite, 1),
            -99,
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
        }
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
