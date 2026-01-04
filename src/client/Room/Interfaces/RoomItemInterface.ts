import { RoomPosition } from "@/Interfaces/RoomPosition";
import RoomItemSpriteInterface from "./RoomItemSpriteInterface";

export default interface RoomItemInterface {
    priority: number;
    position?: RoomPosition;
    sprites: RoomItemSpriteInterface[];

    process(): void;
};
