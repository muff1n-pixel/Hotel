import { RoomPosition } from "../../../../Interfaces/Room/RoomPosition.js";

export type PlaceFurnitureInRoom = {
    userFurnitureId: string;

    position: RoomPosition;
    direction: number;
}
