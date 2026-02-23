import { UserBotData } from "../../../Interfaces/Room/RoomBotData.js";

export type UserBotsEventData = {
    allUserBots?: UserBotData[];
    updatedUserBots?: UserBotData[];
    deletedUserBots?: UserBotData[];
};
