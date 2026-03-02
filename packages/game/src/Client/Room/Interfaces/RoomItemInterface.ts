import { RoomPositionData } from "@pixel63/events";
import RoomSprite from "../Items/RoomSprite";

export default interface RoomItemInterface {
    priority: number;
    position?: RoomPositionData;
    sprites: RoomSprite[];
    disabled: boolean;
    type: string;

    process(frame: number): void;
    setPosition(position: RoomPositionData): void;
};
