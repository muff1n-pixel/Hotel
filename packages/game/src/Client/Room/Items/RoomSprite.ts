/* eslint-disable @typescript-eslint/no-unused-vars */

import { MousePosition } from "@Client/Interfaces/MousePosition";
import RoomItemSpriteInterface from "../Interfaces/RoomItemSpriteInterface";
import RoomItem from "./RoomItem";
import { RoomPositionData } from "@pixel63/events";

export default class RoomSprite implements RoomItemSpriteInterface {
    priority: number = 0;
    tag?: string;
    
    constructor(public item: RoomItem) {

    }

    render(context: OffscreenCanvasRenderingContext2D): void {
        
    }

    mouseover(position: MousePosition): RoomPositionData | null {
        return null;
    }

    //
}