import { ServerAddUserAchievementScoreData, ServerSetUserAchievementScoreData } from "@pixel63/events";
import { roomServer } from "../..";
import { AchievementId } from "../../../Database/Models/Achievements/AchievementModel";
import RoomWebSocketUser from "./RoomWebSocketUser";

export default class RoomWebSocketUserAchievements {
    constructor(private readonly user: RoomWebSocketUser) {

    }

    public addTotalAchievementScore(achievementId: AchievementId, score: number) {
        roomServer.websocket.sendServerProtobuff(ServerSetUserAchievementScoreData, ServerSetUserAchievementScoreData.create({
            userId: this.user.id,
            achievementId,
            totalScore: score
        }));
    }

    public addAchievementScore(achievementId: AchievementId, score: number) {
        roomServer.websocket.sendServerProtobuff(ServerAddUserAchievementScoreData, ServerAddUserAchievementScoreData.create({
            userId: this.user.id,
            achievementId,
            score
        }));
    }
}