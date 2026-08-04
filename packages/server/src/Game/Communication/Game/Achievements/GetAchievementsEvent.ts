import { AchievementData, AchievementsCategoriesData, AchievementsData, BadgeData, GetAchievementsData } from "@pixel63/events";
import ProtobuffListener from "../../Interfaces/ProtobuffListener";
import User from "../../../Users/User";
import { AchievementCategoryModel } from "../../../Database/Models/Achievements/AchievementCategoryModel";
import { AchievementModel } from "../../../Database/Models/Achievements/AchievementModel";
import { UserAchievementModel } from "../../../Database/Models/Users/Achievements/UserAchievementModel";
import { Op } from "sequelize";
import { BadgeModel } from "../../../Database/Models/Badges/BadgeModel";
import { randomUUID } from "crypto";

export default class GetAchievementsEvent implements ProtobuffListener<GetAchievementsData> {
    minimumDurationBetweenEvents?: number = 200;
    
    async handle(user: User, payload: GetAchievementsData): Promise<void> {
        const category = await AchievementCategoryModel.findByPk(payload.categoryId, {
            include: [
                {
                    model: AchievementModel,
                    as: "achievements"
                }
            ]
        });

        if(!category) {
            throw new Error("Category does not exist.");
        }

        const userAchievements = await UserAchievementModel.findAll({
            where: {
                userId: user.model.id,
                achievementId: {
                    [Op.in]: category.achievements.map((achievement) => achievement.id)
                }
            }
        });

        const userBadges = await Promise.all(userAchievements.map((userAchievement) => {
            return new Promise<BadgeModel | null>((resolve) => {
                const achievement = category.achievements.find((achievement) => achievement.id === userAchievement.achievementId);

                if(achievement) {
                    BadgeModel.findByPk(`${achievement.badgePrefix}${userAchievement.level}`).then(resolve).catch(() => resolve(null));

                    return;
                }

                resolve(null);
            });
        }));

        user.sendProtobuff(AchievementsData, AchievementsData.create({
            categoryId: category.id,
            achievements: category.achievements.map((achievement) => {
                const userAchievement = userAchievements.find((userAchievement) => userAchievement.achievementId === achievement.id);

                const badge = (userAchievement?.level)?(
                    userBadges.find((badge) => badge?.id === `${achievement.badgePrefix}${userAchievement.level}`)
                ):(null);

                return {
                    id: (badge)?(achievement.id):(randomUUID()),

                    levels: achievement.levels.length,
                    userLevel: userAchievement?.level ?? 0,
                    
                    currentBadge: (badge)?(BadgeData.fromJSON(badge)):(undefined),

                    currentLevelScore: (userAchievement && userAchievement.level > 0)?(achievement.levels[userAchievement.level - 1] ?? 0):(0),
                    currentUserScore: userAchievement?.score ?? 0,

                    nextLevelScore: achievement.levels[userAchievement?.level ?? 0] ?? 0,
                };
            })
        }));
    }
}
