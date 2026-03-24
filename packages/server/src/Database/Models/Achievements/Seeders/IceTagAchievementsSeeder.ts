import { AchievementCategoryModel } from "../AchievementCategoryModel";
import { AchievementModel } from "../AchievementModel";

export type IceTagAchievements = 
    "BladesOfGlory"
    | "IceIceBadge"
    | "IceRinkBuilder";

export default class IceTagAchievementsSeeder {
    public static async seedAchievements() {
        await AchievementModel.upsert({
            id: "BladesOfGlory",
            categoryId: "games",
            name: "Blades Of Glory",
            description: "For being caught %score% times while playing Ice Tag.",
            badgePrefix: "ACH_TagB",
            levels: [
                1, 4, 9, 17, 29, 44, 62, 87, 114, 144, 186, 242, 314, 402, 498, 618, 754, 905, 1084, 1284
            ]
        });
        
        await AchievementModel.upsert({
            id: "IceIceBadge",
            categoryId: "games",
            name: "Ice Ice baby",
            description: "For spending %score% minutes on a skate rink.",
            badgePrefix: "ACH_TagC",
            levels: [
                3, 8, 16, 31, 51, 81, 121, 171, 231, 301, 381, 471, 571, 681, 801, 931, 1071, 1221, 1381, 1551
            ]
        });
        
        await AchievementModel.upsert({
            id: "IceRinkBuilder",
            categoryId: "games",
            name: "Ice Rink Builder",
            description: "For creating an Ice Rink using %score% Skating Patches.",
            badgePrefix: "ACH_TagA",
            levels: [
                10, 20, 30, 45, 60, 80, 100, 125, 150, 170
            ]
        });
    }
}