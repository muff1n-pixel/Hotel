import { AchievementModel } from "../../AchievementModel";

export type SnowboardAchievements = 
    "SnowboardJumps";

export default class SnowboardAchievementsSeeder {
    public static async seedAchievements() {
        await AchievementModel.upsert({
            id: "SnowboardJumps",
            categoryId: "games",
            name: "Snowboard Jumps",
            description: "For hitting an ollie or 360 %score% times while Snowboarding.",
            badgePrefix: "ACH_SnowB",
            levels: [
                1, 4, 9, 17, 29, 44, 62, 87, 114, 144, 186, 242, 314, 402, 498, 618, 754, 905, 1084, 1284
            ]
        });
    }
}
