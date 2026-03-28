import { AchievementCategoryModel } from "../../AchievementCategoryModel";
import { AchievementModel } from "../../AchievementModel";

export type FreezeAchievements = 
    "FreezeFighter"
    | "FreezeWinner"
    | "FreezePlayer"
    | "FreezePowerUpper";

export default class FreezeAchievementsSeeder {
    public static async seedAchievements() {
        await AchievementModel.upsert({
            id: "FreezeFighter",
            categoryId: "games",
            name: "Freeze Fighter",
            description: "For freezing %score% players during games of Freeze.",
            badgePrefix: "ACH_EsA",
            levels: [
                2, 5, 10, 18, 30, 50, 80, 125, 200, 300, 420, 600, 900, 1500, 2500, 3700, 5400, 8000, 12000, 20000
            ]
        });
        
        await AchievementModel.upsert({
            id: "FreezeWinner",
            categoryId: "games",
            name: "Freeze Winner",
            description: "For gaining %score% winner points while playing Freeze.",
            badgePrefix: "ACH_FreezeWinner",
            levels: [
                50, 125, 240, 410, 655, 1045, 1615, 2465, 2765, 6215, 10865, 19665, 68115, 128415, 242965, 460615, 874115, 1659765, 3123515
            ]
        });
        
        await AchievementModel.upsert({
            id: "FreezePlayer",
            categoryId: "games",
            name: "Freeze Player",
            description: "For gaining %score% points through playing Freeze.",
            badgePrefix: "ACH_FreezePlayer",
            levels: [
                50, 125, 240, 410, 655, 1045, 1615, 2465, 2765, 6215, 10865, 19665, 68115, 128415, 242965, 460615, 874115, 1659765, 3123515
            ]
        });
        
        await AchievementModel.upsert({
            id: "FreezePowerUpper",
            categoryId: "games",
            name: "Freeze Power-Upper",
            description: "For collecting %score% power-ups while playing Freeze.",
            badgePrefix: "ACH_FreezePowerUp",
            levels: [
                100, 300, 600, 1000, 1500, 2100, 2900, 3900, 5200, 6800, 8800, 11200, 14100, 17600, 22100, 28100, 36100, 48100, 66100, 96100
            ]
        });
    }
}