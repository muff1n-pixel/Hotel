import { RoomPosition } from "../../../../Interfaces/Room/RoomPosition.js";

export type PlaceBotEventData = {
    userBotId: string;

    position: RoomPosition;
    direction: number;
}
