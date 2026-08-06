import { ServerSetUserAchievementScoreData } from "@pixel63/events";
import { ServerProtobuffListener } from "../Interfaces/ServerProtobuffListener";
import { game } from "../..";
import RoomWorker from "../../Rooms/RoomWorker";
import { AchievementId } from "../../../Database/Models/Achievements/AchievementModel";

export default class ServerSetUserAchievementScoreEvent implements ServerProtobuffListener<ServerSetUserAchievementScoreData> {
    minimumDurationBetweenEvents?: number = 200;

    async handle(client: RoomWorker, payload: ServerSetUserAchievementScoreData) {
        const user = game.getUserById(payload.userId);

        if(!user) {
            throw new Error("User is not connected.");
        }
        
        user.achievements.addTotalAchievementScore(payload.achievementId as AchievementId, payload.totalScore);
    }
}
