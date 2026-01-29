import Furniture from "@Client/Furniture/Furniture";
import RoomItemSpriteInterface from "@Client/Room/Interfaces/RoomItemSpriteInterface";
import RoomFurnitureSprite from "./RoomFurnitureSprite";
import RoomItem from "../RoomItem";
import { RoomPosition } from "@Client/Interfaces/RoomPosition";

export default class RoomFurnitureItem extends RoomItem {
    sprites: RoomItemSpriteInterface[] = [];

    public readonly id = Math.random();
    
    constructor(public readonly furnitureRenderer: Furniture, position?: RoomPosition) {
        super("furniture");

        if(position) {
            this.setPosition(position);
        }

        this.render();
    }
    
    process(frame: number): void {
        super.process(frame);

        this.render(frame);
    }

    render(frame: number = 0) {
        this.furnitureRenderer.render(frame).then((sprites) => {
            this.sprites = sprites.map((sprite) => new RoomFurnitureSprite(this, sprite));
        });
    }
}
