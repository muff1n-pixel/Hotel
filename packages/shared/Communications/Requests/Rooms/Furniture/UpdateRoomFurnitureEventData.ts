import { RoomPosition } from "../../../../Interfaces/Room/RoomPosition.js";

export type UpdateRoomFurnitureEventData = {
    roomFurnitureId: string;

    direction?: number;
    position?: RoomPosition;
    color?: number;
};
