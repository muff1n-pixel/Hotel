import { AchievementModel } from "../../AchievementModel";

export type BunnyRunAchievements = 
    "CarrotsOfGlory";

export default class BunnyRunAchievementsSeeder {
    public static async seedAchievements() {
        await AchievementModel.upsert({
            id: "CarrotsOfGlory",
            categoryId: "games",
            name: "Carrots Of Glory",
            description: "For being caught %score% times while playing Bunny Run.",
            badgePrefix: "ACH_BunR",
            levels: [
                1, 4, 9, 17, 29, 44, 62, 87, 114, 144, 186, 242, 314, 402, 498, 618, 754, 905, 1084, 1284
            ]
        });
    }
}
