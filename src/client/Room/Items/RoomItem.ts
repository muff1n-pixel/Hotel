import { RoomPosition } from "@/Interfaces/RoomPosition";
import RoomItemInterface from "../Interfaces/RoomItemInterface";
import RoomSprite from "./RoomSprite";

export default class RoomItem implements RoomItemInterface {
    position?: RoomPosition;
    priority: number = 0;
    disabled: boolean = false;

    constructor(public type: string, public sprites: RoomSprite[] = []) {

    }

    process(frame: number): void {
        
    }

    public setPosition(position: RoomPosition, index: number = 0) {
        //this.data.position = { row, column, depth };

        this.position = position;
        this.priority = index;
    }
}
