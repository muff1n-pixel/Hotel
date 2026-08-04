import { AchievementsCategoriesData, GetAchievementsCategoriesData } from "@pixel63/events";
import ProtobuffListener from "../../Interfaces/ProtobuffListener";
import User from "../../../Users/User";
import { AchievementCategoryModel } from "../../../Database/Models/Achievements/AchievementCategoryModel";
import { AchievementModel } from "../../../Database/Models/Achievements/AchievementModel";
import { UserAchievementModel } from "../../../Database/Models/Users/Achievements/UserAchievementModel";

export default class GetAchievementsCategoriesEvent implements ProtobuffListener<GetAchievementsCategoriesData> {
    minimumDurationBetweenEvents?: number = 200;
    
    async handle(user: User, payload: GetAchievementsCategoriesData): Promise<void> {
        const categories = await AchievementCategoryModel.findAll({
            include: [
                {
                    model: AchievementModel,
                    as: "achievements"
                }
            ]
        });

        const userAchievements = await UserAchievementModel.findAll({
            where: {
                userId: user.model.id
            }
        });

        user.sendProtobuff(AchievementsCategoriesData, AchievementsCategoriesData.create({
            categories: categories.map((category) => {
                return {
                    id: category.id,
                    name: category.name,
                    iconImage: category.iconImage,
                    
                    totalLevels: category.achievements.reduce((totalLevels, achievement) => achievement.levels.length + totalLevels, 0),
                    
                    userUnlockedLevels: userAchievements.reduce((totalLevels, userAchievement) => (
                        category.achievements.some((achievement) => achievement.id === userAchievement.achievementId)?(
                            userAchievement.level + totalLevels
                        ):(
                            totalLevels
                        )
                    ), 0),

                    userLevelScore: userAchievements.reduce((totalScore, userAchievement) => (
                        category.achievements.some((achievement) => achievement.id === userAchievement.achievementId)?(
                            userAchievement.score + totalScore
                        ):(
                            totalScore
                        )
                    ), 0)
                };
            })
        }));
    }
}
