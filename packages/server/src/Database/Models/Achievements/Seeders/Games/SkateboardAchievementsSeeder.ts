import { AchievementModel } from "../../AchievementModel";

export type SkateboardAchievements = 
    "SkateboardJumper"
    | "SkateboardSlider";

export default class SkateboardAchievementsSeeder {
    public static async seedAchievements() {
        await AchievementModel.upsert({
            id: "SkateboardJumper",
            categoryId: "games",
            name: "Skateboard Jumper",
            description: "For completing %score% jumps on a skateboard.",
            badgePrefix: "ACH_SkateBoardJump",
            levels: [
                5, 13, 25, 45, 75, 120, 185, 300, 475, 750, 1125, 1675, 2500, 3750, 5600, 8750, 13500, 20000, 30000, 50000
            ]
        });
        
        await AchievementModel.upsert({
            id: "SkateboardSlider",
            categoryId: "games",
            name: "Skateboard Slider",
            description: "For sliding %score% times on a skateboard.",
            badgePrefix: "ACH_SkateBoardSlide",
            levels: [
                20, 50, 100, 180, 300, 480, 750, 1200, 1900, 3000, 4500, 6700, 10000, 15000, 22500, 35000, 54000, 80000, 120000, 200000
            ]
        });
    }
}