import { ServerAddUserAchievementScoreData, ServerSetUserAchievementScoreData } from "@pixel63/events";
import { AchievementId } from "../../../Database/Models/Achievements/AchievementModel";
import User from "../User";
import RoomServer from "../../RoomServer";

export default class UserAchievementsBridge {
    constructor(private readonly user: User) {

    }

    public addTotalAchievementScore(achievementId: AchievementId, score: number) {
        RoomServer.websocket.sendServerProtobuff(ServerSetUserAchievementScoreData, ServerSetUserAchievementScoreData.create({
            userId: this.user.id,
            achievementId,
            totalScore: score
        }));
    }

    public addAchievementScore(achievementId: AchievementId, score: number) {
        RoomServer.websocket.sendServerProtobuff(ServerAddUserAchievementScoreData, ServerAddUserAchievementScoreData.create({
            userId: this.user.id,
            achievementId,
            score
        }));
    }
}