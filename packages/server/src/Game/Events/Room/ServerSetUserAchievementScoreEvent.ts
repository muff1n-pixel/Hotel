import { ServerSetUserAchievementScoreData } from "@pixel63/events";
import { ServerProtobuffListener } from "../Interfaces/ServerProtobuffListener";
import RoomWorker from "../../Rooms/RoomWorker";
import { AchievementId } from "../../../Database/Models/Achievements/AchievementModel";
import UserAchievements from "../../Users/Achievements/UserAchievements";

export default class ServerSetUserAchievementScoreEvent implements ServerProtobuffListener<ServerSetUserAchievementScoreData> {
    minimumDurationBetweenEvents?: number = 200;

    async handle(client: RoomWorker, payload: ServerSetUserAchievementScoreData) {
        const userAchievements = new UserAchievements(payload.userId);
        
        userAchievements.addTotalAchievementScore(payload.achievementId as AchievementId, payload.totalScore);
    }
}
