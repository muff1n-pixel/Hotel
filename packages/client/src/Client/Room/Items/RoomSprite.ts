import { MousePosition } from "@/Interfaces/MousePosition";
import { RoomPosition } from "@/Interfaces/RoomPosition";
import RoomItemSpriteInterface from "../Interfaces/RoomItemSpriteInterface";
import RoomItemInterface from "../Interfaces/RoomItemInterface";
import RoomItem from "./RoomItem";

export default class RoomSprite implements RoomItemSpriteInterface {
    priority: number = 0;
    
    constructor(public item: RoomItem) {

    }

    render(context: OffscreenCanvasRenderingContext2D): void {
        
    }

    mouseover(position: MousePosition): RoomPosition | null {
        return null;
    }

    //
}