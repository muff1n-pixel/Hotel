import Furniture from "@Client/Furniture/Furniture";
import RoomItemSpriteInterface from "@Client/Room/Interfaces/RoomItemSpriteInterface";
import RoomFurnitureSprite from "./RoomFurnitureSprite";
import RoomItem from "../RoomItem";
import { RoomPosition } from "@Client/Interfaces/RoomPosition";
import RoomRenderer from "@Client/Room/Renderer";

export default class RoomFurnitureItem extends RoomItem {
    sprites: RoomItemSpriteInterface[] = [];

    public readonly id = Math.random();
    
    constructor(public roomRenderer: RoomRenderer, public readonly furnitureRenderer: Furniture, position?: RoomPosition) {
        super(roomRenderer, "furniture");

        if(position) {
            this.setPosition(position);
        }

        this.render();
    }
    
    process(frame: number): void {
        super.process(frame);

        this.render();
    }

    render() {
        if(this.furnitureRenderer.type !== "tile_cursor") {
            this.furnitureRenderer.size = this.roomRenderer.size;
        }
        
        this.furnitureRenderer.render().then((sprites) => {
            this.sprites = sprites.map((sprite) => new RoomFurnitureSprite(this, sprite));
        });
    }
}
