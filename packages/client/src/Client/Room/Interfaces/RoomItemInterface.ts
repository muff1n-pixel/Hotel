import { RoomPosition } from "@Client/Interfaces/RoomPosition";
import RoomItemSpriteInterface from "./RoomItemSpriteInterface";
import RoomSprite from "../Items/RoomSprite";

export default interface RoomItemInterface {
    priority: number;
    position?: RoomPosition;
    sprites: RoomSprite[];
    disabled: boolean;
    type: string;

    process(frame: number): void;
    setPosition(position: RoomPosition): void;
};
