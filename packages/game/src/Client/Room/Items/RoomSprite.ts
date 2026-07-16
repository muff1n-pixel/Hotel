/* eslint-disable @typescript-eslint/no-unused-vars */

import { MousePosition } from "@Client/Interfaces/MousePosition";
import RoomItemSpriteInterface from "../Interfaces/RoomItemSpriteInterface";
import RoomItem from "./RoomItem";
import { RoomPositionData, RoomPositionWithDirectionData } from "@pixel63/events";
import { BLEND_MODES, Sprite, Texture, TextureSourceLike } from "pixi.js";

export default class RoomSprite implements RoomItemSpriteInterface {
    tag?: string;

    public sprite: Sprite;
    
    constructor(
        public item: RoomItem,
        public offset: MousePosition = { left: 0, top: 0 },
        public priority: number = 0,
        public alpha: number | undefined = undefined,
        public blendMode: BLEND_MODES = "normal",
        image?: TextureSourceLike,
        imageData?: ImageData
    ) {
        this.sprite = new Sprite({
            texture: (image)?(Texture.from(image)):(undefined),
            x: this.item.screenPosition.left + offset.left,
            y: this.item.screenPosition.top + offset.top,
            alpha: alpha ?? this.item.alpha,
            blendMode,
            zIndex: this.item.calculatedPriority + this.priority
        });

        this.item.roomRenderer.container.addChild(this.sprite);
    }

    update(): void {
        this.sprite.x = this.item.screenPosition.left + this.offset.left;
        this.sprite.y = this.item.screenPosition.top + this.offset.top;

        this.sprite.zIndex = this.item.calculatedPriority + this.priority;

        this.sprite.blendMode = this.blendMode;
        this.sprite.alpha = this.alpha ?? this.item.alpha;

        this.sprite.visible = !this.item.disabled;
    }

    destroy(): void {
        this.sprite.destroy();
    }

    render(context: OffscreenCanvasRenderingContext2D, left: number, top: number): void {
        
    }

    mouseover(position: MousePosition): RoomPositionWithDirectionData | null {
        return null;
    }

    isPositionInsideBounds?(startPosition: MousePosition, endPosition: MousePosition): boolean;

    //
}