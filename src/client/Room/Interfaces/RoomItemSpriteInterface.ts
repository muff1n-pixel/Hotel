import { MousePosition } from "@/Interfaces/MousePosition";
import { RoomPosition } from "@/Interfaces/RoomPosition";
import RoomItem from "../Items/RoomItem";

export default interface RoomItemSpriteInterface {
    item: RoomItem;
    priority: number;

    render(context: OffscreenCanvasRenderingContext2D): void;
    mouseover(position: MousePosition): RoomPosition | null;
};
