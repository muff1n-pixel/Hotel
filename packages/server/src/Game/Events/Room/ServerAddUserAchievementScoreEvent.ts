import { ServerAddUserAchievementScoreData } from "@pixel63/events";
import { ServerProtobuffListener } from "../Interfaces/ServerProtobuffListener";
import { game } from "../..";
import RoomWorker from "../../Rooms/RoomWorker";
import { AchievementId } from "../../../Database/Models/Achievements/AchievementModel";
import UserAchievements from "../../Users/Achievements/UserAchievements";

export default class ServerAddUserAchievementScoreEvent implements ServerProtobuffListener<ServerAddUserAchievementScoreData> {
    minimumDurationBetweenEvents?: number = 200;

    async handle(client: RoomWorker, payload: ServerAddUserAchievementScoreData) {
        const userAchievements = new UserAchievements(payload.userId);
        
        userAchievements.addAchievementScore(payload.achievementId as AchievementId, payload.score);
    }
}
