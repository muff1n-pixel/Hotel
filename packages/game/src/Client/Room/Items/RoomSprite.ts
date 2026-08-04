/* eslint-disable @typescript-eslint/no-unused-vars */

import { MousePosition } from "@Client/Interfaces/MousePosition";
import RoomItemSpriteInterface from "../Interfaces/RoomItemSpriteInterface";
import RoomItem from "./RoomItem";
import { RoomPositionData, RoomPositionWithDirectionData } from "@pixel63/events";
import { BLEND_MODES, Sprite, Texture, TextureSourceLike } from "pixi.js";

export default class RoomSprite implements RoomItemSpriteInterface {
    tag?: string;

    public _sprite: Sprite;

    private disabled: boolean = false;
    
    constructor(
        public item: RoomItem,
        public offset: MousePosition = { left: 0, top: 0 },
        public priority: number = 0,
        public alpha: number | undefined = undefined,
        public blendMode: BLEND_MODES = "normal",
        image?: TextureSourceLike,
        public inheritOffset: boolean = true,
        public inheritPriority: boolean = true
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

        let zIndex: number;

        if(this.inheritPriority) {
            zIndex = this.item.calculatedPriority + this.priority;
        }
        else {
            zIndex = this.priority;
        }
        
        this._sprite = new Sprite({
            texture: (image)?(Texture.from(image)):(undefined),
            x,
            y,
            alpha: alpha ?? this.item.alpha,
            blendMode,
            zIndex,
        });

        this._sprite.texture.source.scaleMode = "nearest";

        this.item.roomRenderer.container.addChild(this._sprite);
    }

    public setMask(sprite: RoomSprite) {
        this._sprite.setMask({
            mask: sprite.getMask(),
            inverse: false,
            channel: "alpha"
        });
    }

    public getMask() {
        return this._sprite;
    }

    public setTexture(texture: TextureSourceLike) {
        this._sprite.texture = Texture.from(texture);
        this._sprite.texture.source.scaleMode = "nearest";

        this.update();
    }

    public setDisabled(disabled: boolean) {
        this._sprite.visible = !disabled;
    }

    update(): void {
        if(this._sprite.destroyed) {
            return;
        }

        if(this.inheritOffset) {
            this._sprite.x = this.item.screenPosition.left + this.offset.left;
            this._sprite.y = this.item.screenPosition.top + this.offset.top;
        }
        else {
            this._sprite.x = this.offset.left;
            this._sprite.y = this.offset.top;
        }
        
        if(this.inheritPriority) {
            this._sprite.zIndex = this.item.calculatedPriority + this.priority;
        }
        else {
            this._sprite.zIndex = this.priority;
        }

        this._sprite.blendMode = this.blendMode;
        this._sprite.alpha = this.alpha ?? this.item.alpha;

        this._sprite.visible = !this.item.disabled || !this.disabled;
    }

    destroy(): void {
        this._sprite.destroy();
    }

    mouseover(position: MousePosition): RoomPositionWithDirectionData | null {
        return null;
    }

    isPositionInsideBounds?(startPosition: MousePosition, endPosition: MousePosition): boolean;

    //

    isSpriteInView() {
        const bounds = this._sprite.getBounds();
        const screen = this.item.roomRenderer.application.screen;

        return (
            bounds.right >= 0 &&
            bounds.left <= screen.width &&
            bounds.bottom >= 0 &&
            bounds.top <= screen.height
        );
    }
}