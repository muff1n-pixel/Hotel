import { UserBotData } from "../../../../Interfaces/Room/RoomBotData.js";

export type RoomBotEventData = {
    botAdded?: UserBotData[];
    botUpdated?: UserBotData[];
    botRemoved?: {
        id: string;
    }[];
};
