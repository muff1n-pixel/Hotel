import RoomSprite from "@Client/Room/Items/RoomSprite";
import { Sprite, Texture } from "pixi.js";

export default class RoomEntitySprite extends Sprite {
    entity?: RoomSprite;

    constructor(texture: Texture, entity: RoomSprite) {
        super(texture);

        this.entity = entity;
    }

    
}