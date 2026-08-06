import { ServerAddUserAchievementScoreData } from "@pixel63/events";
import { ServerProtobuffListener } from "../Interfaces/ServerProtobuffListener";
import { game } from "../..";
import RoomWorker from "../../Rooms/RoomWorker";
import { AchievementId } from "../../../Database/Models/Achievements/AchievementModel";

export default class ServerAddUserAchievementScoreEvent implements ServerProtobuffListener<ServerAddUserAchievementScoreData> {
    minimumDurationBetweenEvents?: number = 200;

    async handle(client: RoomWorker, payload: ServerAddUserAchievementScoreData) {
        const user = game.getUserById(payload.userId);

        if(!user) {
            throw new Error("User is not connected.");
        }
        
        user.achievements.addAchievementScore(payload.achievementId as AchievementId, payload.score);
    }
}
