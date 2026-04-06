import { MousePosition } from "@Client/Interfaces/MousePosition";
import RoomItem from "../Items/RoomItem";
import { RoomPositionWithDirectionData } from "@pixel63/events";

export default interface RoomItemSpriteInterface {
    item: RoomItem;
    priority: number;

    render(context: OffscreenCanvasRenderingContext2D, left: number, top: number): void;
    mouseover(position: MousePosition): RoomPositionWithDirectionData | null;
    isPositionInsideBounds?(startPosition: MousePosition, endPosition: MousePosition): boolean;
};
