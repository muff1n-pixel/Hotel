import { RoomPosition } from "@/Interfaces/RoomPosition";
import RoomItemInterface from "../Interfaces/RoomItemInterface";
import RoomItemSpriteInterface from "../Interfaces/RoomItemSpriteInterface";

export default class RoomItem implements RoomItemInterface {
    position?: RoomPosition;
    priority: number = 0;

    constructor(public sprites: RoomItemSpriteInterface[] = []) {

    }

    process(): void {
        
    }

    public setPosition(position: RoomPosition, index: number = 0) {
        //this.data.position = { row, column, depth };

        this.position = position;
        this.priority = index;
    }
}
