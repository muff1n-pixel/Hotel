import { RoomFurnitureData } from "../../../../Interfaces/Room/RoomFurnitureData.js";

export type RoomFurnitureEventData = {
    furnitureAdded?: RoomFurnitureData[];
    furnitureUpdated?: RoomFurnitureData[];
    furnitureRemoved?: {
        id: string;
    }[];
};
