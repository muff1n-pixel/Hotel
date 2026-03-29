import { randomUUID } from "crypto";
import { AchievementId, AchievementModel } from "../../Database/Models/Achievements/AchievementModel";
import { UserAchievementModel } from "../../Database/Models/Users/Achievements/UserAchievementModel";
import { UserBadgeModel } from "../../Database/Models/Users/Badges/UserBadgeModel";
import User from "../User";
import { BadgeModel } from "../../Database/Models/Badges/BadgeModel";
import { BadgeData, WidgetNotificationData } from "@pixel63/events";
import RomanNumerals from "../../Helpers/RomanNumerals";
import { UserModel } from "../../Database/Models/Users/UserModel";
import { game } from "../..";

export default class UserAchievements {
    constructor(private readonly userId: string) {

    }

    public async addTotalAchievementScore(achievementId: AchievementId, score: number) {
        if(score <= 0) {
            return;
        }

        const userAchievement = await this.getUserAchievement(achievementId);

        
        let nextLevel = userAchievement.level;
        let nextLevelScore = userAchievement.achievement.levels[userAchievement.level];

        while(nextLevelScore && score > userAchievement.score && score >= nextLevelScore) {
            nextLevel++;
            nextLevelScore = userAchievement.achievement.levels[nextLevel];
        }

        if(nextLevel !== userAchievement.level) {
            await userAchievement.update({
                score: score
            });

            await this.setUserAchievementLevel(userAchievement, nextLevel);
        }
    }

    public async addAchievementScore(achievementId: AchievementId, score: number) {
        if(score <= 0) {
            return;
        }
        
        const userAchievement = await this.getUserAchievement(achievementId);


        await userAchievement.update({
            score: userAchievement.score + score
        });

        let nextLevel = userAchievement.level;
        let nextLevelScore = userAchievement.achievement.levels[userAchievement.level];

        while(nextLevelScore && userAchievement.score >= nextLevelScore) {
            nextLevel++;
            nextLevelScore = userAchievement.achievement.levels[nextLevel];
        }

        if(nextLevel !== userAchievement.level) {
            await this.setUserAchievementLevel(userAchievement, nextLevel);
        }
    }

    private async getUserAchievement(achievementId: AchievementId) {
        const achievement = await AchievementModel.findByPk(achievementId);

        if(!achievement) {
            throw new Error("Achievement does not exist.");
        }

        const [userAchievement] = await UserAchievementModel.findOrCreate({
            where: {
                userId: this.userId,
                achievementId: achievement.id
            }
        });

        userAchievement.achievement = achievement;

        return userAchievement;
    }

    private async setUserAchievementLevel(userAchievement: UserAchievementModel, nextLevel: number) {
        const lastLevel = userAchievement.level;

        await userAchievement.update({
            level: nextLevel
        });

        const badge = await BadgeModel.findByPk(`${userAchievement.achievement.badgePrefix}${userAchievement.level}`);

        if(badge) {
            const userBadge = await UserBadgeModel.findOne({
                where: {
                    userId: this.userId,
                    badgeId: `${userAchievement.achievement.badgePrefix}${userAchievement.level - 1}`
                }
            });

            if(!userBadge) {
                await UserBadgeModel.create({
                    id: randomUUID(),
                    userId: this.userId,
                    badgeId: badge.id,
                });
            }
            else {
                await userBadge.update({
                    badgeId: badge.id
                });
            }

            const user = game.getUserById(this.userId);

            if(user) {
                await user.getInventory().sendBadges();
                
                for(let level = lastLevel + 1; level <= nextLevel; level++) {
                    user.sendProtobuff(WidgetNotificationData, WidgetNotificationData.create({
                        id: randomUUID(),
                        text: `You have unlocked the ${userAchievement.achievement.name} ${new RomanNumerals(level).toString()} achievement!`,
                        badge: BadgeData.fromJSON({
                            ...badge,
                            image: `${userAchievement.achievement.badgePrefix}${level - 1}.gif`
                        })
                    }));
                }
            }
        }
    }
}
