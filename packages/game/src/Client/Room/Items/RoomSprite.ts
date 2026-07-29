/* eslint-disable @typescript-eslint/no-unused-vars */

import { MousePosition } from "@Client/Interfaces/MousePosition";
import RoomItemSpriteInterface from "../Interfaces/RoomItemSpriteInterface";
import RoomItem from "./RoomItem";
import { RoomPositionData, RoomPositionWithDirectionData } from "@pixel63/events";
import { BLEND_MODES, Sprite, Texture, TextureSourceLike } from "pixi.js";

export default class RoomSprite implements RoomItemSpriteInterface {
    tag?: string;

    private sprite: Sprite;

    private disabled: boolean = false;
    
    constructor(
        public item: RoomItem,
        public offset: MousePosition = { left: 0, top: 0 },
        public priority: number = 0,
        public alpha: number | undefined = undefined,
        public blendMode: BLEND_MODES = "normal",
        image?: TextureSourceLike,
        public inheritOffset: boolean = true
    ) {
        let x: number;
        let y: number;

        if(this.inheritOffset) {
            x = this.item.screenPosition.left + this.offset.left;
            y = this.item.screenPosition.top + this.offset.top;
        }
        else {
            x = this.offset.left;
            y = this.offset.top;
        }
        
        this.sprite = new Sprite({
            texture: (image)?(Texture.from(image)):(undefined),
            x,
            y,
            alpha: alpha ?? this.item.alpha,
            blendMode,
            zIndex: this.item.calculatedPriority + this.priority,
        });

        this.sprite.texture.source.scaleMode = "nearest";

        this.item.roomRenderer.container.addChild(this.sprite);
    }

    public setMask(sprite: RoomSprite) {
        this.sprite.setMask({
            mask: sprite.getMask(),
            inverse: false,
            channel: "alpha"
        });
    }

    public getMask() {
        return this.sprite;
    }

    public setTexture(texture: TextureSourceLike) {
        this.sprite.texture = Texture.from(texture);
        this.sprite.texture.source.scaleMode = "nearest";

        this.update();
    }

    public setDisabled(disabled: boolean) {
        this.sprite.visible = !disabled;
    }

    update(): void {
        if(this.inheritOffset) {
            this.sprite.x = this.item.screenPosition.left + this.offset.left;
            this.sprite.y = this.item.screenPosition.top + this.offset.top;
        }
        else {
            this.sprite.x = this.offset.left;
            this.sprite.y = this.offset.top;
        }

        this.sprite.zIndex = this.item.calculatedPriority + this.priority;

        this.sprite.blendMode = this.blendMode;
        this.sprite.alpha = this.alpha ?? this.item.alpha;

        this.sprite.visible = !this.item.disabled || !this.disabled;
    }

    destroy(): void {
        this.sprite.destroy();
    }

    mouseover(position: MousePosition): RoomPositionWithDirectionData | null {
        return null;
    }

    isPositionInsideBounds?(startPosition: MousePosition, endPosition: MousePosition): boolean;

    //
}