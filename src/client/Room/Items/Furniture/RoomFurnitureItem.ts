import FurnitureRenderer from "@/Furniture/FurnitureRenderer.js";
import ContextNotAvailableError from "../../../Exceptions/ContextNotAvailableError.js";
import { MousePosition } from "@/Interfaces/MousePosition";
import RoomItemInterface from "@/Room/Interfaces/RoomItemInterface.js";
import RoomItemSpriteInterface from "@/Room/Interfaces/RoomItemSpriteInterface";
import FloorRenderer from "@/Room/Structure/FloorRenderer";
import RoomFurnitureSprite from "./RoomFurnitureSprite.js";
import RoomItem from "../RoomItem.js";
import { RoomPosition } from "@/Interfaces/RoomPosition.js";

export default class RoomFurnitureItem extends RoomItem {
    sprites: RoomItemSpriteInterface[] = [];

    constructor(public readonly furnitureRenderer: FurnitureRenderer, position: RoomPosition) {
        super("furniture");

        this.setPosition(position);

        this.render();
    }
    
    process(frame: number): void {
        super.process(frame);

        if(this.furnitureRenderer.isAnimated) {
            this.render(frame);
        }
    }

    render(frame: number = 0) {
        this.furnitureRenderer.render(frame).then((sprites) => {
            this.sprites = sprites.map((sprite) => new RoomFurnitureSprite(this, sprite));
        });
    }
}
