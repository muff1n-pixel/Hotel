import RoomItemSpriteInterface from "../Interfaces/RoomItemSpriteInterface";
import RoomItem from "./RoomItem";
import { RoomPositionWithDirectionData } from "@pixel63/events";

export default class RoomTextSprite implements RoomItemSpriteInterface {
    priority: number = 1000;
    tag?: string;
    
    constructor(public item: RoomItem, private readonly text: string) {

    }

    render(context: OffscreenCanvasRenderingContext2D): void {
        context.font = "14px Ubuntu Bold";
        context.textAlign = "center";
        context.fillStyle = "green";

        context.fillText(this.text, 64, 0);
    }

    mouseover(): RoomPositionWithDirectionData | null {
        return null;
    }
}