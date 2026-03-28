import { AchievementModel } from "../AchievementModel";

export type BattleBanzaiAchievements = 
    "LordOfTheTiles"
    | "BattleBanzaiStar"
    | "BattleBanzaiPlayer";

export default class BattleBanzaiAchievementsSeeder {
    public static async seedAchievements() {
        await AchievementModel.upsert({
            id: "LordOfTheTiles",
            categoryId: "games",
            name: "Lord of the Tiles",
            description: "For locking %score% tiles playing Battle Banzai.",
            badgePrefix: "ACH_BattleBallTilesLocked",
            levels: [
                25, 65, 125, 205, 335, 525, 805, 1235, 1875, 2875, 4375, 6875, 10775, 17075, 27175, 43275, 69075, 110375, 176375, 282075
            ]
        });
        
        await AchievementModel.upsert({
            id: "BattleBanzaiStar",
            categoryId: "games",
            name: "Battle Banzai Star",
            description: "For gaining %score% winning points while playing Battle Banzai.",
            badgePrefix: "ACH_BattleBallWinner",
            levels: [
                50, 100, 240, 410, 655, 1045, 1615, 2465, 3765, 6215, 10865, 19665, 36365, 68115, 128415, 242965, 460615, 874115, 1659765, 3152515
            ]
        });
        
        await AchievementModel.upsert({
            id: "BattleBanzaiPlayer",
            categoryId: "games",
            name: "Battle Banzai Player",
            description: "For earning %score% points through playing Battle Banzai.",
            badgePrefix: "ACH_BattleBallPlayer",
            levels: [
                50, 100, 240, 410, 655, 1045, 1615, 2465, 3765, 6215, 10865, 19665, 36365, 68115, 128415, 242965, 460615, 874115, 1659765, 3152515
            ]
        });
    }
}