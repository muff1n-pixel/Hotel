import FurnitureRenderer from "@Client/Furniture/FurnitureRenderer";
import RoomItemSpriteInterface from "@Client/Room/Interfaces/RoomItemSpriteInterface";
import RoomFurnitureSprite from "./RoomFurnitureSprite";
import RoomItem from "../RoomItem";
import { RoomPosition } from "@Client/Interfaces/RoomPosition";

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
