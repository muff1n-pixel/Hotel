import { randomUUID } from "crypto";
import { AchievementId, AchievementModel } from "../../Database/Models/Achievements/AchievementModel";
import { UserAchievementModel } from "../../Database/Models/Users/Achievements/UserAchievementModel";
import { UserBadgeModel } from "../../Database/Models/Users/Badges/UserBadgeModel";
import User from "../User";
import { BadgeModel } from "../../Database/Models/Badges/BadgeModel";
import { BadgeData, WidgetNotificationData } from "@pixel63/events";
import RomanNumerals from "../../Helpers/RomanNumerals";

export default class UserAchievements {
    constructor(private readonly user: User) {

    }

    public async addAchievementScore(achievementId: AchievementId, score: number) {
        const achievement = await AchievementModel.findByPk(achievementId);

        if(!achievement) {
            throw new Error("Achievement does not exist.");
        }

        const [userAchievement] = await UserAchievementModel.findOrCreate({
            where: {
                userId: this.user.model.id,
                achievementId: achievement.id
            }
        });

        userAchievement.achievement = achievement;

        const nextLevelScore = userAchievement.achievement.levels[userAchievement.level];

        await userAchievement.update({
            score: userAchievement.score + score
        });

        if(nextLevelScore && userAchievement.score >= nextLevelScore) {
            await userAchievement.update({
                level: userAchievement.level + 1
            });

            const badge = await BadgeModel.findByPk(`${userAchievement.achievement.badgePrefix}${userAchievement.level}`);

            if(badge) {
                const userBadge = await UserBadgeModel.findOne({
                    where: {
                        userId: this.user.model.id,
                        badgeId: `${userAchievement.achievement.badgePrefix}${userAchievement.level - 1}`
                    }
                });

                if(!userBadge) {
                    await UserBadgeModel.create({
                        id: randomUUID(),
                        userId: this.user.model.id,
                        badgeId: badge.id,
                    });
                }
                else {
                    await userBadge.update({
                        badgeId: badge.id
                    });
                }

                await this.user.getInventory().sendBadges();
                
                this.user.sendProtobuff(WidgetNotificationData, WidgetNotificationData.create({
                    id: randomUUID(),
                    text: `You have unlocked the ${userAchievement.achievement.name} ${new RomanNumerals(userAchievement.level)} achievement!`,
                    badge: BadgeData.fromJSON(badge)
                }));
            }
        }
    }
}
