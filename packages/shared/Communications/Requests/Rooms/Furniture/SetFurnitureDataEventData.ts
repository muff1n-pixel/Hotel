import { RoomMoodlightData } from "../../../../Interfaces/Room/RoomMoodlightData.js"

export type SetFurnitureDataEventData<T> = {
    furnitureId: string;
    data: T;
};
