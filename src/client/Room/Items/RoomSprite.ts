import { MousePosition } from "@/Interfaces/MousePosition";
import { RoomPosition } from "@/Interfaces/RoomPosition";
import RoomItemSpriteInterface from "../Interfaces/RoomItemSpriteInterface";
import RoomItemInterface from "../Interfaces/RoomItemInterface";

export default class RoomSprite implements RoomItemSpriteInterface {
    priority: number = 0;
    
    constructor(public item: RoomItemInterface) {

    }

    render(context: OffscreenCanvasRenderingContext2D): void {
        
    }

    mouseover(position: MousePosition): RoomPosition | null {
        return null;
    }

    //
}